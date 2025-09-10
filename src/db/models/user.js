import { model, Schema } from 'mongoose';
import {USER_ROLES} from "../../constants/roles.js";

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, num: Object.values(USER_ROLES), default: USER_ROLES.PARENT },
    },
    { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};


export const User = model('user', userSchema);
