import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String },
},
    { timestamps: true }
);

export const TeamModel = mongoose.model('TeamMember', TeamMemberSchema);