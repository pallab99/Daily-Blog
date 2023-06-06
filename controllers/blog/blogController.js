import { Blog } from '../../model/blog/blogModel.js';

export const getAllBlog = async (req, res, next) => {
  const allBlogs = await Blog.find({});
  res.json({
    success: true,
    blog: allBlogs,
  });
};

export const getBlogById = async (req, res, next) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId);
  res.status(200).json({
    success: true,
    blog,
  });
};
export const updateBlogById = async (req, res, next) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId);
  const { title, description } = req.body;
  blog.title = title;
  blog.description = description;

  await blog.save();

  res.status(200).json({
    success: true,
    blog,
  });
};

export const deleteBlogById = async (req, res, next) => {
  const blogId = req.params.id;
  const blog = await Blog.findById(blogId);
  await blog.deleteOne();

  res.status(200).json({
      success: true,
      message: 'Blog Deleted!',
  });
};

export const getBlogsByUser = async (req, res, next) => {
  const userId = req.user.id;
  const blogs = await Blog.find({ userId });
  res.status(200).json({
    success: true,
    blogs,
  });
};

export const createSingleBlog = async (req, res, next) => {
  const { title, description } = req.body;

  const blog = await Blog.create({
    title,
    description,
    userId: req.user.id,
    userEmail: req.user.email,
    userName: req.user.name,
  });

  res.status(201).json({
    success: true,
    message: 'Blog Created SuccessFully',
    blog: blog,
  });
};
