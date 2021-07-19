const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDB = require('../config/db');
const { Post } = require('../models/Post.model');
const { User } = require('../models/User.model');
const { initialUsers, initialPosts } = require('./helpers');

const {
  addPost,
  getAllPosts,
  findPostById,
  like,
  update,
  remove,
} = require('../services/post.service');

beforeAll(() => {
  dotenv.config();
  connectDB(process.env.MONGO_URI_TEST);
});

beforeEach(async () => {
  const user1 = new User(initialUsers[0]);
  await user1.save();

  const post1 = new Post(initialPosts[0]);
  await post1.save();
  const post2 = new Post(initialPosts[1]);
  await post2.save();
});

afterEach(async () => {
  await User.deleteMany({});
  await Post.deleteMany({});
});

describe('posts', () => {
  test('can be created with valid data', async () => {
    const user = await User.findOne({});

    const postBody = 'Test Post 1';

    const post = await addPost(user._id, postBody);

    expect(post).toHaveProperty('id');
  });

  test('can be fetched', async () => {
    const posts = await getAllPosts();

    expect(posts.length).toBe(2);
  });

  test('can be fetched by their id', async () => {
    const posts = await getAllPosts();

    const postFoundWithId = await findPostById(posts[0].id);

    expect(postFoundWithId).toEqual(posts[0]);
  });

  test('can be liked by users', async () => {
    let user = await User.findOne({});
    user = user.renameId();

    let post = await Post.findOne({});
    post = post.renameId();

    const likedPost = await like(user.id, post.id);

    expect(likedPost.likes).toContainEqual(user.id);
    expect(likedPost.totalLikes).toBe(1);
  });

  test('can be updated with a new body', async () => {
    const postToUpdate = await Post.findOne({});
    const newBody = 'Update Post Test 1';
    const updatedPost = await update(
      postToUpdate._id,
      newBody,
      postToUpdate.authorId,
    );

    expect(updatedPost).not.toHaveProperty('error', 'Unauthorized');
    expect(updatedPost.body).toBe(newBody);
    expect(updatedPost.body).not.toBe(postToUpdate.body);
  });

  test('can be deleted', async () => {
    const user = await User.findOne({});
    const postBody = 'post to delete';
    const postToDelete = await addPost(user._id, postBody);

    const postsBeforeDelete = await Post.find({});
    const lengthBeforeDelete = postsBeforeDelete.length;

    const response = await remove(postToDelete.id, user._id);

    const postsAfterDelete = await Post.find({});
    const lengthAfterDelete = postsAfterDelete.length;

    expect(response).toHaveProperty('message', 'Post deleted');
    expect(lengthAfterDelete).toBe(lengthBeforeDelete - 1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
