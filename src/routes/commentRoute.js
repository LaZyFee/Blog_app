import express from 'express';
import AuthMiddleware from '../middlewares/AuthMiddleware.js';
import {
    createComment,
    updateComment,
    deleteComment,
    getAllComments,
} from '../controllers/commentController.js';
import {
    addReply,
    updateReply,
    deleteReply,
    getReplies
} from '../controllers/commentReplyController.js'
import { toggleLike } from '../controllers/likeController.js';

const router = express.Router();
//comment
router.post("/:blog_id/create-comment", AuthMiddleware, createComment);
router.put('/:blog_id/update-comment/:comment_id', AuthMiddleware, updateComment);
router.delete("/:blog_id/delete-comment/:comment_id", AuthMiddleware, deleteComment);

//replies
router.post("/:blog_id/:comment_id/add-reply", AuthMiddleware, addReply);
router.put("/:blog_id/:comment_id/update-reply/:reply_id", AuthMiddleware, updateReply);
router.delete("/:blog_id/:comment_id/delete-reply/:reply_id", AuthMiddleware, deleteReply);
router.get("/comments/:comment_id/replies", getReplies);


// Like/unlike a comment or reply
router.patch("/:id/like-unlike", AuthMiddleware, toggleLike);


//get all comments
router.get("/:blog_id", getAllComments);


export default router;