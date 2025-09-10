import { model, Schema } from 'mongoose';
import {USER_ROLES} from "../../constants/roles.js";

const usersSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, num: Object.values(USER_ROLES), default: USER_ROLES.PARENT },
    },
    { timestamps: true, versionKey: false },
);

export const User = model('users', usersSchema);
