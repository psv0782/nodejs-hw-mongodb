import express, {json} from 'express';
import pino from 'pino-http';
import cors from 'cors';
import indexRouter from "./routers/index.js";

import {ENV_VARS} from "./constants/envVars.js";
import {getEnvVar} from "./utils/getEnvVar.js";
import {notFoundHandler} from "./middlewares/notFoundHandler.js";
import {errorHandler} from "./middlewares/errorHandler.js";
import {requestIdMiddleware} from "./middlewares/requestIdMiddleware.js";
import cookieParser from 'cookie-parser';

const PORT = Number(getEnvVar(ENV_VARS.PORT, 3000));

export const setupServer = () => {

    const app = express();

    app.use([requestIdMiddleware, pino(), cors(), cookieParser()]);

    app.use(
        json({
            type: ['application/json', 'application/vnd.api+json'],
            limit: '100kb',
        }),
    );

    app.use(indexRouter);

    app.use(notFoundHandler);

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};