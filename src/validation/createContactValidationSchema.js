import Joi from 'joi';
import {CONTACT_TYPE} from "../constants/contactType.js";

export const createContactValidationSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'any.required': "It's required",
        'number.min': 'Too low: {#label} - {#value}!',
        'number.max': 'Too large: {#label} - {#value}!',
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
        'any.required': "It's required",
        'number.min': 'Too low: {#label} - {#value}!',
        'number.max': 'Too large: {#label} - {#value}!',
    }),
    email: Joi.string().min(3).max(20).messages({
        'number.min': 'Too low: {#label} - {#value}!',
        'number.max': 'Too large: {#label} - {#value}!',
    }),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().valid(...Object.values(CONTACT_TYPE)).required().default(CONTACT_TYPE.PERSONAL).messages({
        'any.required': "It's required",
    }),
});