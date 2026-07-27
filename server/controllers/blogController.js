import asyncHandler from 'express-async-handler';
import Blog from '../models/Blog.js';
import { sendResponse } from '../utils/apiResponse.js';
import { buildFilter, buildSearch, buildSort, getPagination, buildMeta } from '../utils/apiFeatures.js';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

// @desc    Create a blog post
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = asyncHandler(async (req, res) => {
  const baseSlug = slugify(req.body.title);
  let slug = baseSlug;
  let suffix = 1;
  while (await Blog.findOne({ slug })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const blog = await Blog.create({ ...req.body, slug, author: req.user._id });

  return sendResponse(res, { statusCode: 201, message: 'Blog post created successfully', data: { blog } });
});

// @desc    List blog posts (public sees published only, admin sees everything)
// @route   GET /api/blogs?category=&tags=&status=&search=&sortBy=&order=&page=&limit=
// @access  Public
export const getBlogs = asyncHandler(async (req, res) => {
  const filter = {
    ...buildFilter(req.query, ['category']),
    ...buildSearch(req.query, ['title', 'excerpt', 'content']),
  };

  if (req.query.tags) {
    filter.tags = { $in: req.query.tags.split(',').map((t) => t.trim()) };
  }

  if (!req.user || req.user.role !== 'admin') {
    filter.status = 'published';
  } else if (req.query.status) {
    filter.status = req.query.status;
  }

  const sort = buildSort(req.query, { publishedAt: -1, createdAt: -1 });
  const { page, limit, skip } = getPagination(req.query);

  const [blogs, total] = await Promise.all([
    Blog.find(filter).populate('author', 'name').sort(sort).skip(skip).limit(limit),
    Blog.countDocuments(filter),
  ]);

  return sendResponse(res, {
    statusCode: 200,
    message: 'Blog posts fetched successfully',
    data: { blogs },
    meta: buildMeta({ page, limit, total }),
  });
});

// @desc    Get a single blog post by id or slug (increments view count on published posts)
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  const blog = await Blog.findOne(isObjectId ? { _id: id } : { slug: id }).populate('author', 'name');

  if (!blog || (blog.status !== 'published' && (!req.user || req.user.role !== 'admin'))) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  if (blog.status === 'published') {
    blog.views += 1;
    await blog.save();
  }

  return sendResponse(res, { statusCode: 200, message: 'Blog post fetched successfully', data: { blog } });
});

// @desc    Update a blog post
// @route   PATCH /api/blogs/:id
// @access  Private/Admin
export const updateBlog = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  delete updates.slug;

  const blog = await Blog.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  return sendResponse(res, { statusCode: 200, message: 'Blog post updated successfully', data: { blog } });
});

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  return sendResponse(res, { statusCode: 200, message: 'Blog post deleted successfully' });
});

// @desc    Like a blog post
// @route   POST /api/blogs/:id/like
// @access  Private
export const likeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );

  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found');
  }

  return sendResponse(res, { statusCode: 200, message: 'Blog post liked', data: { likes: blog.likes } });
});
