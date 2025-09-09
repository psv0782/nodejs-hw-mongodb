import Joi from 'joi';
import {CONTACT_TYPE} from "../constants/contactType.js";
import {contactTypeValidation} from "./helpers.js";

export const getContactsQueryParamsValidationSchema = Joi.object({
    page: Joi.number().min(1).default(1),
    perPage: Joi.number().min(1).max(100).default(10),
    sortBy: Joi.string().valid('name', 'phoneNumber', 'email', 'contactType').default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc'),

    type: contactTypeValidation(),
    isFavourite: Joi.bool(),
});