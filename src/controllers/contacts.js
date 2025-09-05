import {getContactById, getContacts, createContact, deleteContact, updateContact} from "../services/contacts.js";
import createHttpError from "http-errors";

export const getContactsController = async (req, res) => {
    const contacts = await getContacts();

    res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
}

export const getContactByIdController = async (req, res) => {
    const {contactId} = req.params;
    const contact = await getContactById(contactId);

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
    const contact = await createContact(req.body);

    res.status(201).json({
        status: 201,
        message: `Successfully created a contact!`,
        data: contact,
    });
}

export const deleteContactController = async (req, res) => {
    const {contactId} = req.params;
    const contact = await deleteContact(contactId);

    if (!contact) {
        throw createHttpError(404, `${contactId} contact not found`);
    }
    res.status(204).end();
}

export const upsertContactController = async (req, res) => {
    const {contactId} = req.params;
    const result = await updateContact(contactId, req.body, {
        upsert: true,
    });

    if (!result) {
        throw createHttpError(404, `${contactId} contact not found`);
    }

    const status = result.isNew ? 201 : 200;

    res.status(status).json({
        status,
        message: `Successfully upserted a ${contactId} contact!`,
        data: result.contact,
    });
}

export const patchContactController = async (req, res) => {
    const {contactId} = req.params;
    const result = await updateContact(contactId, req.body);

    if (!result) {
        throw createHttpError(404, `${contactId} contact not found`);
    }
    res.json({
        status: 200,
        message: `Successfully patched a ${contactId} contact!`,
        data: result.contact
    });
}