const asyncHandler = require('express-async-handler');

const { Post } = require('./../models/Post.model');
const { User } = require('./../models/User.model');

const addPost = asyncHandler(async (userId, postBody) => {
  const user = await User.findById(userId);

  if (user.error) {
    return { error: 'User not found' };
  }

  const newPost = {
    body: postBody,
    authorId: user.id,
    authorUsername: user.username,
    authorName: user.name,
  };

  let post = await Post.create(newPost);
  post = post.renameId();

  if (post) {
    user.posts.push(post.id);

    await user.save();

    return post;
  }
});

const getAllPosts = asyncHandler(async () => {
  let posts = await Post.find({}).sort('-createdAt');

  posts = posts.map((post) => post.renameId());

  return posts;
});

const findPostById = asyncHandler(async (postId) => {
  let post = await Post.findById(postId);

  if (post) {
    post = post.renameId();

    return post;
  }

  return { error: 'Post not found' };
});

const getTimeline = asyncHandler(async (userId) => {
  let user = await User.findById(userId);

  if (!user) {
    return { error: 'User not found' };
  }

  let posts = [];

  for (author of user.following) {
    const post = await Post.find({ authorId: author });
    posts = posts.concat(post);
  }

  return posts;
});

const like = asyncHandler(async (userId, postId) => {
  let post = await Post.findById(postId);

  if (!post) {
    return { error: 'Post not found' };
  }

  const user = await User.findById(userId);

  if (!user) {
    return { error: 'User not found' };
  }

  if (post.likes.includes(userId) || user.likedPosts.includes(postId)) {
    // Unlike if the user already likes the post
    post.likes = post.likes.filter((l) => !l.equals(user._id));
    user.likedPosts = user.likedPosts.filter((l) => !l.equals(post._id));
  } else {
    // Like if the user do not like the post
    post.likes.push(user._id);
    user.likedPosts.push(post._id);
  }

  post.totalLikes = post.likes.length;

  await post.save();
  await user.save();

  post = post.renameId();

  return post;
});

const update = asyncHandler(async (postId, postBody, userId) => {
  let post = await Post.findById(postId);

  if (!post) {
    return { error: 'Post not found' };
  }

  if (!post.authorId.equals(userId)) {
    return { error: 'Unauthorized' };
  }

  post.body = post.body !== postBody ? postBody : post.body;

  await post.save();

  post = post.renameId();

  return post;
});

const remove = asyncHandler(async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    return { error: 'Post not found' };
  }

  if (!post.authorId.equals(userId)) {
    return { error: 'Unauthorized' };
  }

  const user = await User.findById(userId);

  if (!user) {
    return { error: 'User not found' };
  }

  user.posts = user.posts.filter((p) => !p.equals(postId));

  await user.save();

  await post.delete();

  return { message: 'Post deleted' };
});

module.exports = {
  addPost,
  getAllPosts,
  findPostById,
  getTimeline,
  like,
  update,
  remove,
};
