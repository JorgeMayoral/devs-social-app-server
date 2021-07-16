const asyncHandler = require('express-async-handler');

const { Post } = require('./../models/Post.model');
const {
  findUserById,
  addPostToUser,
  addLikedPost,
  removePostFromUser,
} = require('./user.service');

const addPost = asyncHandler(async (userId, postBody) => {
  const user = await findUserById(userId);

  if (user.error) {
    return user;
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
    await addPostToUser(userId, post.id);

    return post;
  }
});

const getAllPosts = asyncHandler(async () => {
  let posts = await Post.find({});

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

const like = asyncHandler(async (userId, postId) => {
  const post = await Post.findById(postId);

  if (!post) {
    return { error: 'Post not found' };
  }

  const user = await addLikedPost(userId, post.id);

  if (user.error) {
    return { error: user.error };
  }

  if (post.likes.includes(userId)) {
    // Unlike if the user already likes the post
    post.likes = post.likes.filter((l) => !l.equals(user.id));
  } else {
    // Like if the user do not like the post
    post.likes.push(user.id);
  }

  post.totalLikes = post.likes.length;

  await post.save();

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

  const user = await removePostFromUser(userId, postId);

  if (user.error) {
    return { error: user.error };
  }

  await post.delete();

  return { message: 'Post deleted' };
});

module.exports = { addPost, getAllPosts, findPostById, like, update, remove };
