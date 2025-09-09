export const validateBody = (schema) => async (req, res, next) => {
        const {error, value} = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
            convert: true,
        });
    if (error) return next(error);
    req.body = value;
    next();
};
