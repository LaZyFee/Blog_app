import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["like", "dislike"], required: true },
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    reactions: [reactionSchema],
    likes: { type: Number, default: 0, min: 0 },
    disLikes: { type: Number, default: 0, min: 0 },
    type: { type: String, enum: ["comment", "reply"], default: "comment" },
    status: { type: String, enum: ["approved", "hidden"], default: "approved", index: true },
    deleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

commentSchema.index({ parent: 1, type: 1, status: 1, deleted: 1, createdAt: -1 });
commentSchema.index({ createdBy: 1 });

export const CommentModel = mongoose.model("Comment", commentSchema);
