import {
    getContactById,
    getContacts,
    createContact,
    deleteContact,
    updateContact,
    upsertContact
} from "../services/contacts.js";
import createHttpError from "http-errors";
import {USER_ROLES} from "../constants/roles.js";

const buildContactFilters = (query) => ({
    type: query.type,
    isFavourite: query.isFavourite,
});

export const getContactsController = async (req, res) => {

    if (!req.user?._id) {
        throw createHttpError(401, 'Unauthorized');
    }

    const filters = buildContactFilters(req.validatedQuery);


    if (req.user.role === USER_ROLES.OWNER) {
        filters.userId = req.user._id;
    }

    const contactsPage = await getContacts(
        {
            page: Number(req.validatedQuery.page) || 1,
            perPage: Number(req.validatedQuery.perPage) || 10,
            sortBy: req.validatedQuery.sortBy || 'name',
            sortOrder: req.validatedQuery.sortOrder || 'asc',
            filters,
        },
        req.user._id,
    );

    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contactsPage,
    });
}

export const getContactByIdController = async (req, res) => {
    const {contactId} = req.params;
    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
        throw createHttpError(404, 'Contact not found');
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
}

export const postCreateContactController = async (req, res) => {
    const contact = await createContact({
        ...req.body,
        userId: req.user._id
    });

    res.status(201).json({
        status: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
}

export const deleteContactController = async (req, res) => {
    const {contactId} = req.params;
    const contact = await deleteContact(contactId, req.user._id);

    if (!contact) {
        throw createHttpError(404, `${contactId} contact not found`);
    }
    res.status(204).end();
}

export const upsertContactController = async (req, res) => {
    const {contactId} = req.params;

    const {isNew, contact} = await upsertContact(contactId, {
        ...req.body,
        userId: req.user._id},
        req.user._id,);

    const status = isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: `Successfully upserted a contact!`,
        data: contact,
    });
}

export const patchContactController = async (req, res) => {
    const {contactId} = req.params;
    const result = await updateContact(contactId, req.body, req.user._id);

    if (!result) {
        throw createHttpError(404, `${contactId} contact not found`);
    }
    res.json({
        status: 200,
        message: `Successfully patched a ${contactId} contact!`,
        data: result.contact
    });
}