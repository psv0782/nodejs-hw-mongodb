import crypto from "node:crypto";
import createHttpError from "http-errors";
import {User} from "../db/models/user.js";
import {Session} from "../db/models/session.js";
import bcrypt from "bcrypt";
import {ENV_VARS} from "../constants/envVars.js";
import {getEnvVar} from "../utils/getEnvVar.js";
import {sendMail} from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import Handlebars from "handlebars";
import fs from "node:fs";
import path from "node:path";
import {TEMPLATE_DIR_PATH} from "../constants/path.js";

const resetPasswordTemplate = fs
    .readFileSync(path.join(TEMPLATE_DIR_PATH, 'send-reset-email-password.html'))
    .toString();


const createSession = (userId) => ({
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 1000 * 60 * 15), //15 min
    refreshTokenValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), //30 days
    userId,
});

export const registerUser = async (payload) => {
    const existingUser = await User.findOne({email: payload.email});
    if (existingUser) {
        throw createHttpError(409, 'User with this email already registered!');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    const user = await User.create({
        ...payload,
        password: encryptedPassword,
    });

    return user;
};

export const loginUser = async ({email, password}) => {
    const user = await User.findOne({email});

    if (!user) {
        throw createHttpError(404, 'User with given credentials does not exist!');
    }

    const arePasswordsEqual = await bcrypt.compare(password, user.password);

    if (!arePasswordsEqual) {
        throw createHttpError(404, 'User with given credentials does not exist!');
    }

    await Session.deleteOne({userId: user._id});

    const session = await Session.create(createSession(user._id));

    return session;
};

export const logoutUser = async (sessionId) => {
    await Session.findByIdAndDelete(sessionId);
};

export const refreshSession = async (sessionId, refreshToken) => {
    const session = await Session.findOne({_id: sessionId, refreshToken});

    if (!session) {
        throw createHttpError(401, 'Session not found!');
    }

    if (session.refreshTokenValidUntil < new Date()) {
        await Session.findByIdAndDelete(sessionId);
        throw createHttpError(401, 'Session expired!');
    }

    const user = await User.findById(session.userId);

    if (!user) {
        await Session.findByIdAndDelete(sessionId);
        throw createHttpError(401, 'Session not found!');
    }

    await Session.findByIdAndDelete(sessionId);

    const newSession = await Session.create(createSession(user._id));

    return newSession;
}

export const sendResetPasswordEmail = async (email) => {
    try {
        const user = await User.findOne({email});

        if (!user) {
            throw createHttpError(404, 'User not found!');
        }

        const host = getEnvVar(ENV_VARS.FRONTEND_DOMAIN);
        const token = jwt.sign(
            {
                sub: user._id,
                email: user.email
            },
            getEnvVar(ENV_VARS.JWT_SECRET),
            {
                expiresIn: '5m',
            },
        );

        const resetPasswordLink = `${host}/reset-password?token=${token}`;

        const template = Handlebars.compile(resetPasswordTemplate);

        const html = template({
            name: user.name,
            link: resetPasswordLink,
        });

        await sendMail({
            to: email,
            subject: 'Reset your password!',
            html
        });
    } catch {
        throw createHttpError(
            500,
            'Failed to send the email, please try again later.',
        );
    }
};

export const resetPassword = async (token, password) => {
    let payload;

    try {
        payload = jwt.verify(token, getEnvVar(ENV_VARS.JWT_SECRET));
    } catch (err) {
        console.error(err);
        throw createHttpError(401, 'Token is expired or invalid.');
    }

    const user = await User.findById(payload.sub);

    if (!user) {
        throw createHttpError(404, 'User not found!');
    }

    user.password = await bcrypt.hash(password, 10);

    await user.save();

    await logoutUser(user.sessionId);
};
