import Joi from 'joi';
import {CONTACT_TYPE} from "../constants/contactType.js";

export const nameValidation = () => Joi.string().min(3).max(20);
export const phoneNumberValidation = () => Joi.string().min(3).max(20);
export const emailValidation = () => Joi.string().min(3).max(20);
export const contactTypeValidation = () => Joi.string().valid(...Object.values(CONTACT_TYPE));