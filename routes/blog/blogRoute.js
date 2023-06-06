import express from 'express';
import {
  createSingleBlog,
  deleteBlogById,
  getAllBlog,
  getBlogById,
  getBlogsByUser,
  updateBlogById,
} from '../../controllers/blog/blogController.js';
import { validateToken } from '../../middlewares/tokenHandler.js';
const router = express.Router();

router.post('/createSingleBlog', validateToken, createSingleBlog);
router.get('/getAllBlogs', getAllBlog);
router.get('/getBlogsByUser', validateToken, getBlogsByUser);
router.route('/:id').get(getBlogById).put(updateBlogById).delete(deleteBlogById);

export default router;
