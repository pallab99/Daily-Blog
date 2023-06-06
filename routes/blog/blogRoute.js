import express from 'express';
import {
  createSingleBlog,
  getAllBlog,
  getBlogsByUser,
} from '../../controllers/blog/blogController.js';
import { validateToken } from '../../middlewares/tokenHandler.js';
const router = express.Router();

router.post('/createSingleBlog', validateToken, createSingleBlog);
router.get('/getAllBlogs', getAllBlog);
router.get('/getBlogsByUser', validateToken, getBlogsByUser);

export default router;
