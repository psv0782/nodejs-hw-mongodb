import {model, Schema} from 'mongoose';
import {CONTACT_TYPE} from "../../constants/contactType.js";

const contactSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        isFavourite: {
            type: Boolean,
            default: false,
        },
        contactType: {
            type: String,
            enum: Object.values(CONTACT_TYPE),
            required: true,
            default: 'personal',
        }
    },
    {
        timestamps: true,
    });

export const Contacts = model('contact', contactSchema);