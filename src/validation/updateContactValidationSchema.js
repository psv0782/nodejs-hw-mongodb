import Joi from 'joi';
import {CONTACT_TYPE} from "../constants/contactType.js";
import {emailValidation, nameValidation, phoneNumberValidation} from "./helpers.js";

export const updateContactValidationSchema = Joi.object({
    name: nameValidation(),
    phoneNumber: phoneNumberValidation(),
    email: emailValidation(),
    isFavourite: Joi.bool().default(false),
    contactType: Joi.string().valid(...Object.values(CONTACT_TYPE))
});