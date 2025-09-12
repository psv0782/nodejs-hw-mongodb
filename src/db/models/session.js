import { model, Schema, Types } from 'mongoose';
import {User} from "./user.js";

const sessionSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: User,
            required: true,
            unique: true,
        },
        accessToken: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            required: true,
        },
        accessTokenValidUntil: {
            type: Date,
            required: true,
        },
        refreshTokenValidUntil: {
            type: Date,
            required: true,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

export const Session = model('session', sessionSchema);
