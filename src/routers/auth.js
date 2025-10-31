import {Router} from "express";
import {validateBody} from "../middlewares/validateBody.js";
import {
    getGoogleOAuthUrlController,
    loginUserController, loginWithGoogleController,
    logoutUserController,
    refreshSessionController,
    registerUserController,
    resetPasswordController,
    sendResetPasswordEmailController
} from "../controllers/auth.js";
import {registerUserValidationSchema} from "../validation/registerUserValidationSchema.js";
import {loginUserValidationSchema} from "../validation/loginUserValidationSchema.js";
import { sendResetPasswordValidationSchema } from '../validation/sendResetPasswordValidationSchema.js';
import { resetPasswordValidationSchema } from '../validation/resetPasswordValidationSchema.js';
import {ctrlWrapper} from "../utils/ctrlWrapper.js";
import {loginWithGoogleOAuthSchema} from "../validation/auth.js";

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
    '/send-reset-email',
    validateBody(sendResetPasswordValidationSchema),
    ctrlWrapper(sendResetPasswordEmailController)
);

authRouter.post(
    '/reset-pwd',
    validateBody(resetPasswordValidationSchema),
    ctrlWrapper(resetPasswordController)
);

authRouter.get('/google-oauth-url',
    ctrlWrapper(getGoogleOAuthUrlController)
);

authRouter.post(
    '/confirm-oauth',
    validateBody(loginWithGoogleOAuthSchema),
    ctrlWrapper(loginWithGoogleController),
);

export default authRouter;
