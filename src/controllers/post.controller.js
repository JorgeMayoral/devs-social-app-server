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

module.exports = { createPost };
