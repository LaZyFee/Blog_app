import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        image: { type: String },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        commentsCount: { type: Number, default: 0 },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        reactions: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                type: { type: String, enum: ["like", "dislike"], required: true },
            },
        ],

        likes: { type: Number, default: 0 },
        disLikes: { type: Number, default: 0 },

    },
    { timestamps: true }
);

export const BlogModel = mongoose.model("Blog", BlogSchema);