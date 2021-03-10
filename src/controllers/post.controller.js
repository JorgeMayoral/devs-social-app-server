const { Post } = require('./../models/Post.model');
const { User } = require('./../models/User.model');

/**
 * @name Create Post
 * @description Create a post
 * @access Private
 * @route POST /api/v1/post
 */
const createPost = async (req, res) => {
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
};
/**
 * @name Get Posts
 * @description Get all posts
 * @access Public
 * @route GET /api/v1/post/all
 */
const getPosts = async (req, res) => {
  const posts = await Post.find({});
  res.status(200).json(posts);
};

/**
 * @name Get Post by Id
 * @description Get a Post by Id
 * @access Public
 * @route GET /api/v1/post/:id
 */
const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404);
    throw new Error('ERROR: Post not found');
  }
};

/**
 * @name Like Post
 * @description Give a like to a post / Remove it if it's already liked
 * @access Private
 * @route PUT /api/v1/post/:id/like
 */
const likePost = async (req, res) => {
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
};

module.exports = { createPost, getPosts, getPostById, likePost };
