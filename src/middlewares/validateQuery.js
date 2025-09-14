export const validateQuery = (schema) => async (req, res, next) => {
    const {error, value} = schema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
    });

    if (error) return next(error);
    req.validatedQuery = value;
    next();
};
