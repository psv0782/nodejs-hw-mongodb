import {Router} from "express";
import {validateBody} from "../middlewares/validateBody.js";
import {
    loginUserController,
    logoutUserController,
    refreshSessionController,
    registerUserController, resetPasswordController, sendResetPasswordEmailController
} from "../controllers/auth.js";
import {registerUserValidationSchema} from "../validation/registerUserValidationSchema.js";
import {loginUserValidationSchema} from "../validation/loginUserValidationSchema.js";
import { sendResetPasswordValidationSchema } from '../validation/sendResetPasswordValidationSchema.js';
import { resetPasswordValidationSchema } from '../validation/resetPasswordValidationSchema.js';
import {ctrlWrapper} from "../utils/ctrlWrapper.js";

const authRouter = Router();

authRouter.post(
    '/register',
    validateBody(registerUserValidationSchema),
    ctrlWrapper(registerUserController),
);
authRouter.post(
    '/login',
    validateBody(loginUserValidationSchema),
    ctrlWrapper(loginUserController),
);
authRouter.post(
    '/logout',
    ctrlWrapper(logoutUserController)
);
authRouter.post(
    '/refresh-session',
    ctrlWrapper(refreshSessionController)
);

authRouter.post(
    '/send-reset-password-email',
    validateBody(sendResetPasswordValidationSchema),
    ctrlWrapper(sendResetPasswordEmailController)
);

authRouter.post(
    '/reset-password',
    validateBody(resetPasswordValidationSchema),
    ctrlWrapper(resetPasswordController)
);

export default authRouter;
