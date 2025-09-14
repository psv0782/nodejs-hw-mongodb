import {model, Schema} from 'mongoose';
import {USER_ROLES} from "../../constants/roles.js";

const userSchema = new Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        createdAt: {type: Date},
        updatedAt: {type: Date},

        // имплементация с ролями
        // role: {type: String, enum: [USER_ROLES.OWNER, USER_ROLES.WATCHER], default: USER_ROLES.OWNER},
    },
    {timestamps: true, versionKey: false},
);

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};


export const User = model('user', userSchema);
