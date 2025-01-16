import express from 'express'
import AuthMiddleware from '../middlewares/AuthMiddleware.js'
import { uploadBlogPic } from '../utilities/multer.js';
import { CreateBlog, UpdateBlog, DeleteBlog, GetAllBlogs, GetBlogsById } from '../controllers/blogController.js'
import { toggleLike } from '../controllers/likeController.js';
import { multerErrorHandler } from '../middlewares/MulterErrorHaandler.js';

const router = express.Router();

router.get('/all-blogs', GetAllBlogs)
router.get('/blog/:id', GetBlogsById)
router.post('/create-blog', AuthMiddleware, multerErrorHandler(uploadBlogPic.single('image')), CreateBlog)
router.put('/update-blog/:id', multerErrorHandler(uploadBlogPic.single('image')), UpdateBlog)
router.delete('/delete-blog/:id', DeleteBlog)
router.patch("/:id/like-unlike", AuthMiddleware, toggleLike);


export default router