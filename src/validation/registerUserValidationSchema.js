import Joi from 'joi';

export const registerUserValidationSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().required().email().required(),
    password: Joi.string().required().min(6).required(),
    // .max(30)
    // .regex(/.*[A-Z].*/, { name: 'One uppercase' })
    // .regex(/.*[a-z].*/)
    // .regex(/^(?=.*[@#$%^&*()]).+$/),
});
