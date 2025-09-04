import express, {json} from 'express';
import pino from 'pino-http';
import cors from 'cors';
import crypto from 'node:crypto';

import {ENV_VARS} from "./constants/envVars.js";
import {getEnvVar} from "./utils/getEnvVar.js";
import contactsRouter from "./routers/contacts.js";
import {notFoundHandler} from "./middlewares/notFoundHandler.js";
import {errorHandler} from "./middlewares/errorHandler.js";

const PORT = Number(getEnvVar(ENV_VARS.PORT, 3000));

export const setupServer = () => {

    const app = express();

    app.use([
        (req, res, next) => {
            req.id = crypto.randomUUID();
            next();
        },
        pino(),
        cors(),
    ]);

    app.use(
        json({
            type: ['application/json', 'application/vnd.api+json'],
            limit: '100kb',
        }),
    );

    app.use(contactsRouter);

    app.use(notFoundHandler);

    app.use(errorHandler);
    //
    // app.use((req, res) => {
    //     res.status(404).json({
    //         message: 'Not found',
    //         status: 404,
    //     });
    // });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};