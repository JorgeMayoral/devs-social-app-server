const asyncHandler = require('express-async-handler');
const {
  addPost,
  findPostById,
  like,
  getAllPosts,
  update,
  remove,
  getTimeline,
} = require('../services/post.service');

const { Post } = require('./../models/Post.model');
const { User } = require('./../models/User.model');

/**
 * @name Create Post
 * @description Create a post
 * @access Private
 * @route POST /api/v1/post
 */
const createPost = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const postBody = req.body.body;

  if (!postBody) {
    res.status(400);
    throw new Error('Invalid post data');
  }

  const response = await addPost(userId, postBody);

  if (response.error) {
    res.status(400);
    throw new Error(response.error);
  }

  res.status(200);
  res.json(response);
});

/**
 * @name Get Posts
 * @description Get all posts
 * @access Public
 * @route GET /api/v1/post/all
 */
const getPosts = asyncHandler(async (req, res) => {
  const posts = await getAllPosts();
  res.status(200);
  res.json(posts);
});

/**
 * @name Get Post by Id
 * @description Get a Post by Id
 * @access Public
 * @route GET /api/v1/post/:id
 */
const getPostById = asyncHandler(async (req, res) => {
  const postId = req.params.id;

  if (!postId) {
    res.status(400);
    throw new Error('Post ID missing');
  }

  const response = await findPostById(postId);

  if (response.error) {
    res.status(404);
    throw new Error(response.error);
  }

  res.status(200);
  res.json(response);
});

/**
 * @name Timeline
 * @description Get posts from users followed by the current logged user
 * @access Private
 * @route GET /api/v1/post/timeline
 */
const timeline = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  const posts = await getTimeline(userId);

  res.status(200);
  res.json(posts);
});

/**
 * @name Like Post
 * @description Give a like to a post / Remove it if it's already liked
 * @access Private
 * @route PUT /api/v1/post/:id/like
 */
const likePost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  if (!userId) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  if (!postId) {
    res.status(400);
    throw new Error('Pist ID missing');
  }

  const post = await like(userId, postId);

  res.status(202);
  res.json(post);
});

/**
 * @name Update Post
 * @description Update logged user post
 * @access Private
 * @route PUT /api/v1/post/:id
 */
const updatePost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;
  const postBody = req.body.body;

  if (!userId) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  if (!postId) {
    res.status(400);
    throw new Error('Post ID missing');
  }

  if (!postBody) {
    res.status(400);
    throw new Error('post body missing');
  }

  const response = await update(postId, postBody, userId);

  if (response.error) {
    res.status(400);
    throw new Error(response.error);
  }

  res.status(200);
  res.json(response);
});

/**
 * @name Delete Post
 * @description Delete logged user post
 * @access Private
 * @route DELETE /api/v1/post/:id
 */
const deletePost = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const postId = req.params.id;

  if (!userId) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  if (!postId) {
    res.status(400);
    throw new Error('Post ID missing');
  }

  const response = await remove(postId, userId);

  if (response.error) {
    res.status(400);
    throw new Error(response.error);
  }

  res.status(204);
  res.send();
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  timeline,
  likePost,
  updatePost,
  deletePost,
};
