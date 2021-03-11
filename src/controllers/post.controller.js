const asyncHandler = require('express-async-handler');

const { Post } = require('./../models/Post.model');
const { User } = require('./../models/User.model');

/**
 * @name Create Post
 * @description Create a post
 * @access Private
 * @route POST /api/v1/post
 */
const createPost = asyncHandler(async (req, res) => {
  const { userId, username, name } = req.session;

  if (!userId) {
    res.status(401);
    throw new Error('ERROR: Unauthorized');
  }

  const newPost = {
    body: req.body.body,
    authorId: userId,
    authorUsername: username,
    authorName: name,
  };

  const post = await Post.create(newPost);

  if (post) {
    const user = await User.findById(post.authorId);
    user.posts = [post._id, ...user.posts];
    await user.save();
    res.status(201).json(post);
  }
});

/**
 * @name Get Posts
 * @description Get all posts
 * @access Public
 * @route GET /api/v1/post/all
 */
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({});
  res.status(200).json(posts);
});

/**
 * @name Get Post by Id
 * @description Get a Post by Id
 * @access Public
 * @route GET /api/v1/post/:id
 */
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404);
    throw new Error('ERROR: Post not found');
  }
});

/**
 * @name Like Post
 * @description Give a like to a post / Remove it if it's already liked
 * @access Private
 * @route PUT /api/v1/post/:id/like
 */
const likePost = asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  const postId = req.params.id;

  const user = await User.findById(userId);
  const post = await Post.findById(postId);

  if (!user) {
    res.status(401);
    throw new Error('ERROR: Unauthorized');
  }

  if (!post) {
    res.status(404);
    throw new Error('ERROR: Post not found');
  }

  if (post.likes.includes(userId) || user.likes.includes(postId)) {
    post.likes = post.likes.filter((l) => l != userId);
    user.likes = user.likes.filter((l) => l != postId);
  } else {
    post.likes = [user._id, ...post.likes];
    user.likes = [post._id, ...user.likes];
  }

  post.totalLikes = post.likes.length;

  await post.save();
  await user.save();

  res.status(202).json(post);
});

/**
 * @name Update Post
 * @description Update logged user post
 * @access Private
 * @route PUT /api/v1/post/:id
 */
const updatePost = asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  const post = await Post.findById(req.params.id);
  const { body } = req.body;

  if (!post) {
    res.status(404);
    throw new Error('ERROR: Post not found');
  }

  if (!userId || post.authorId != userId) {
    res.status(401);
    throw new Error('ERROR: Unauthorized');
  } else {
    post.body = post.body !== body ? body : post.body;
  }

  post.save();
  res.status(200).json({ post });
});

/**
 * @name Delete Post
 * @description Delete logged user post
 * @access Private
 * @route DELETE /api/v1/post/:id
 */
const deletePost = asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('ERROR: Post not found');
  }

  if (!userId || post.authorId != userId) {
    res.status(401);
    throw new Error('ERROR: Unauthorized');
  } else {
    const user = await User.findById(post.authorId);
    user.posts = user.posts.filter((p) => p != post._id);
    user.save();
    post.delete();
    res.status(200).json({ message: 'Post deleted' });
  }
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  likePost,
  updatePost,
  deletePost,
};
