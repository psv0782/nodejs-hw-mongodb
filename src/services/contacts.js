import {Contacts} from "../db/models/contacts.js";

export const getContacts = async () => {
    const contacts = await Contacts.find();
    return contacts;
};

export const getContactById = async (contactId) => {
    const contact = await Contacts.findById(contactId);
    return contact;
};

export const createContact = async (payload) => {
    const contact = await Contacts.create(payload);
    return contact;
};

export const deleteContact = async (contactId) => {
    const contact = await Contacts.findOneAndDelete({
        _id: contactId,
    });
    return contact;
}

export const updateContact = async (contactId, payload, options = {}) => {
    const rawResult = await Contacts.findOneAndUpdate(
        { _id: contactId },
        payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options,
        },
    );

    if (!rawResult || !rawResult.value) return null;

    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};