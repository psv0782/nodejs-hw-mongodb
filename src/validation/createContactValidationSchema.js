import Joi from 'joi';
import {
    contactTypeValidation,
    emailValidation,
    nameValidation,
    objectIdValidation,
    phoneNumberValidation
} from "./helpers.js";
import {CONTACT_TYPE} from "../constants/contactType.js";

export const createContactValidationSchema = Joi.object({
    name: nameValidation().required().messages({
        'any.required': "It's required",
        'number.min': 'Too low: {#label} - {#value}!',
        'number.max': 'Too large: {#label} - {#value}!',
    }),
    phoneNumber: phoneNumberValidation().required().messages({
        'any.required': "It's required",
        'number.min': 'Too low: {#label} - {#value}!',
        'number.max': 'Too large: {#label} - {#value}!',
    }),
    email: emailValidation().messages({
        'number.min': 'Too low: {#label} - {#value}!',
        'number.max': 'Too large: {#label} - {#value}!',
    }),
    isFavourite: Joi.bool().default(false),
    contactType: contactTypeValidation().default(CONTACT_TYPE.PERSONAL).required().messages({
        'any.required': "It's required",
    }),
    userId: objectIdValidation()
});