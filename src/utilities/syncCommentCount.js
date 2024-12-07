const syncCommentCounts = async () => {
    try {
        const blogs = await BlogModel.find();

        for (const blog of blogs) {
            const count = await CommentModel.countDocuments({ parent: blog._id });
            await BlogModel.findByIdAndUpdate(blog._id, { commentsCount: count });
        }

        console.log("Comments count synchronized successfully!");
    } catch (error) {
        console.error("Error synchronizing comments count:", error.message);
    }
};

// Call this function as needed
syncCommentCounts();
