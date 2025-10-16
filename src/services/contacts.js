import {Contacts} from "../db/models/contacts.js";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import {saveFile} from "../utils/saveFile.js";

const createPaginationMetadata = (page, perPage, itemsCount) => {
    const totalPages = Math.max(1, Math.ceil(itemsCount / perPage));

    return {
        page,
        perPage,
        totalItems: itemsCount,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
    };
}

const ALLOWED_SORT_FIELDS = ['name','phoneNumber','email','contactType','createdAt','updatedAt'];

export const getContacts = async ({
                                      page = 1,
                                      perPage = 10,
                                      sortBy = 'name',
                                      sortOrder = 'asc',
                                      filters = {},
                                  }, userId) => {
    page = Number.isFinite(+page) && +page > 0 ? +page : 1;
    perPage = Number.isFinite(+perPage) && +perPage > 0 ? +perPage : 10;

    const skip = (page - 1) * perPage;

    const field = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'name';
    const order = String(sortOrder).toLowerCase() === 'desc' ? -1 : 1;

    const where = { userId };

    if (filters?.type) where.contactType = filters.type;
    if (typeof filters?.isFavourite === 'boolean') where.isFavourite = filters.isFavourite;
    else if (filters?.isFavourite === 'true' || filters?.isFavourite === 'false')
        where.isFavourite = filters.isFavourite === 'true';

    const [data, totalItems] = await Promise.all([
        Contacts.find(where).sort({ [field]: order }).skip(skip).limit(perPage).lean(),
        Contacts.countDocuments(where),
    ]);

    return { data, ...createPaginationMetadata(page, perPage, totalItems) };
};

export const getContactById = async (contactId, userId) => {
    if (!mongoose.isValidObjectId(contactId)) return null;
    return Contacts.findOne({ _id: contactId, userId });
};

export const createContact = async (payload) => {
    const contact = await Contacts.create(payload);
    return contact;
};

export const uploadContactsPhoto = async (contactId, file, userId) => {
    const contact = await getContactById(contactId, userId);
    if (!contact) {
        throw createHttpError(404, 'Contact not found!');
    }

    const filePath = await saveFile(file);

    contact.photo = filePath;

    await contact.save();

    return contact;
};

export const deleteContact = async (contactId, userId) => {
    if (!mongoose.isValidObjectId(contactId)) return null;
    return Contacts.findOneAndDelete({
        _id: contactId, userId });
}

export const updateContact = async (contactId, payload, userId, options = {}) => {
    if (!mongoose.isValidObjectId(contactId)) return null;
    const rawResult = await Contacts.findOneAndUpdate(
        {_id: contactId, userId},
        payload,
        {
            new: true,
            includeResultMetadata: true,
            runValidators: true,
            ...options,
        },
    );

    if (!rawResult || !rawResult.value) return null;

    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};


// export const upsertContact = async (contactId, payload, userId) => {
//     const contact = await getContactById(contactId);
//     if (!contact) {
//         const contact = await Contacts.create({_id: contactId, ...payload});
//
//         return {
//             isNew: true,
//             contact,
//         };
//     } else {
//         const contact = await updateContact(contactId, userId, payload);
//
//         return {
//             isNew: false,
//             contact,
//         };
//     }
// };

// ✅ исправленный upsert (тоже с userId)
export const upsertContact = async (contactId, payload, userId) => {
    if (!mongoose.isValidObjectId(contactId)) return null;

    const existing = await Contacts.findOne({ _id: contactId, userId });

    if (!existing) {
        const newContact = await Contacts.create({ _id: contactId, ...payload, userId });
        return { isNew: true, contact: newContact };
    }

    const updated = await Contacts.findOneAndUpdate(
        { _id: contactId, userId },
        payload,
        { new: true, runValidators: true }
    );

    return { isNew: false, contact: updated};
};
