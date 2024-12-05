import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilepic: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    author: { type: Boolean, default: false }
},
    { timestamps: true }
);

export const UserModel = mongoose.model('User', UserSchema);
