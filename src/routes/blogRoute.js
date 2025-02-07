import express from 'express'
import AuthMiddleware from '../middlewares/AuthMiddleware.js'
import { CreateBlog, UpdateBlog, DeleteBlog, GetAllBlogs, GetBlogsById } from '../controllers/blogController.js'
import { toggleLike } from '../controllers/likeController.js';
import { uploadSingle } from '../config/multer.js';

const router = express.Router();

router.get('/all-blogs', GetAllBlogs)
router.get('/blog/:id', GetBlogsById)
router.post('/create-blog', AuthMiddleware, uploadSingle, CreateBlog)
router.put('/update-blog/:id', uploadSingle, UpdateBlog)
router.delete('/delete-blog/:id', DeleteBlog)
router.patch("/:id/like-unlike", AuthMiddleware, toggleLike);

export default router