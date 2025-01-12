import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
        comment: { type: String, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        parent: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
        replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        reactions: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
                type: { type: String, enum: ["like", "dislike"], required: true },
            },
        ],

        likes: { type: Number, default: 0 },
        disLikes: { type: Number, default: 0 },
        type: { type: String, enum: ["comment", "reply"], default: "comment" },
    },
    { timestamps: true }
);

commentSchema.index({ parent: 1 });
commentSchema.index({ createdBy: 1 });

export const CommentModel = mongoose.model("Comment", commentSchema);
