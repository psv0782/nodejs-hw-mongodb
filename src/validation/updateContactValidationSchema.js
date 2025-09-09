import Joi from 'joi';
import {CONTACT_TYPE} from "../constants/contactType.js";

export const updateContactValidationSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().min(3).max(20),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().valid(...Object.values(CONTACT_TYPE))
});