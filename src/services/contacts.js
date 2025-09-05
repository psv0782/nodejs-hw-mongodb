import {Contacts} from "../db/models/contacts.js";
import mongoose from "mongoose";

export const getContacts = async () => {
    return Contacts.find();
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