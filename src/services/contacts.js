import {Contacts} from "../db/models/contacts.js";
import mongoose from "mongoose";

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

export const getContacts = async ({page = 1, perPage = 10}) => {
    page = Number.isFinite(+page) && +page > 0 ? +page : 1;
    perPage = Number.isFinite(+perPage) && +perPage > 0 ? +perPage : 10;

    const skip = (page - 1) * perPage;

    const [contacts, totalItems] = await Promise.all([
        Contacts.find().skip(skip).limit(perPage).lean(),
        Contacts.find().countDocuments(),
    ]);

    const meta = createPaginationMetadata(page, perPage, totalItems);

    // const contacts = Contacts.find().limit(perPage).skip(skip);
    // const contactsCount = await Contacts.find().countDocuments();

    // return {contacts, ...createPaginationMetadata(page, perPage, contactsCount)};
    return {contacts, ...meta};
};

export const getContactById = async (contactId) => {
    if (!mongoose.isValidObjectId(contactId)) return null;
    return Contacts.findById(contactId);
};

export const createContact = async (payload) => {
    const contact = await Contacts.create(payload);
    return contact;
};

export const deleteContact = async (contactId) => {
    if (!mongoose.isValidObjectId(contactId)) return null;
    return Contacts.findOneAndDelete({
        _id: contactId,
    });
}

export const updateContact = async (contactId, payload, options = {}) => {
    if (!mongoose.isValidObjectId(contactId)) return null;
    const rawResult = await Contacts.findOneAndUpdate(
        {_id: contactId},
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