import express from 'express'
import AuthMiddleware from '../middlewares/AuthMiddleware.js'
import { uploadBlogPic } from '../utilities/multer.js';
import { CreateBlog, UpdateBlog, DeleteBlog, GetAllBlogs } from '../controllers/blogController.js'

const router = express.Router();

router.get('/all-blogs', GetAllBlogs)
router.post('/create-blog', AuthMiddleware, uploadBlogPic.single('image'), CreateBlog)
router.put('/update-blog/:id', uploadBlogPic.single('image'), UpdateBlog)
router.delete('/delete-blog/:id', DeleteBlog)

export default router