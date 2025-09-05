import {HttpError} from "http-errors";
import {MongooseError} from "mongoose";

export const errorHandler = (err, req, res, next) => {

    if(err instanceof HttpError){
        res.status(err.status).json({
            status: err.status,
            message: err.name,
            data: err,
        });
        return;
    }

    if (err instanceof MongooseError) {
        return res.status(500).json({
            status: 500,
            message: 'MongooseError',
            error: err.message,
        });
    }

    res.status(500).json({
        message: 'Something went wrong',
        error: err.message,
    });
};