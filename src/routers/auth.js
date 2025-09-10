import {Router} from "express";
import {validateBody} from "../middlewares/validateBody.js";
import {
    loginUserController,
    logoutUserController,
    refreshSessionController,
    registerUserController
} from "../controllers/auth.js";
import {registerUserValidationSchema} from "../validation/registerUserValidationSchema.js";
import {loginUserValidationSchema} from "../validation/loginUserValidationSchema.js";
import {ctrlWrapper} from "../utils/ctrlWrapper.js";

const authRouter = Router();

authRouter.post(
    '/auth/register',
    validateBody(registerUserValidationSchema),
    ctrlWrapper(registerUserController),
);
authRouter.post(
    '/auth/login',
    validateBody(loginUserValidationSchema),
    ctrlWrapper(loginUserController),
);
authRouter.post(
    '/auth/logout',
    ctrlWrapper(logoutUserController)
);
authRouter.post(
    '/auth/refresh-session',
    ctrlWrapper(refreshSessionController)
);

export default authRouter;
