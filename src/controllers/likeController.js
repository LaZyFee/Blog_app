export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params; // ID of comment or reply
        const { action } = req.query; // "like" or "unlike"
        const { isReply } = req.query; // true if targeting a reply

        const increment = action === "like" ? 1 : -1;

        let updatedDocument;

        if (isReply === "true") {
            // Update likes in a reply
            updatedDocument = await CommentModel.findOneAndUpdate(
                { "replies._id": id },
                { $inc: { "replies.$.likes": increment } },
                { new: true }
            );
        } else {
            // Update likes in a comment
            updatedDocument = await CommentModel.findByIdAndUpdate(
                id,
                { $inc: { likes: increment } },
                { new: true }
            );
        }

        if (!updatedDocument) {
            return res.status(404).json({
                status: "failed",
                message: isReply === "true" ? "Reply not found." : "Comment not found.",
            });
        }

        res.status(200).json({
            status: "success",
            message: `${isReply === "true" ? "Reply" : "Comment"} ${action}d successfully.`,
            data: updatedDocument,
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: `Error ${action}ing ${isReply === "true" ? "reply" : "comment"}.`,
            error: error.message,
        });
    }
};
