import Joi from 'joi';
import {CONTACT_TYPE} from "../constants/contactType.js";
import {isValidObjectId} from "mongoose";

export const nameValidation = () => Joi.string().min(3).max(20);
export const phoneNumberValidation = () => Joi.string().min(3).max(20);
export const emailValidation = () => Joi.string().min(3).max(20);
export const contactTypeValidation = () => Joi.string().valid(...Object.values(CONTACT_TYPE));
export const objectIdValidation = () =>
    Joi.string().custom((value, helper) => {
        if (value && !isValidObjectId(value)) {
            return helper.message('User id should be a valid mongo id');
        }
        return true;
    });