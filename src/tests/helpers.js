const mongoose = require('mongoose');

const initialUsers = [
  {
    username: 'example1',
    name: 'User Example 1',
    email: 'example1@example.com',
    password: 'test1234',
  },
  {
    username: 'exmaple2',
    name: 'User Example 2',
    email: 'example2@example.com',
    password: 'test1234',
  },
];

const initialPosts = [
  {
    body: 'Example Post 1',
    authorId: mongoose.Types.ObjectId(),
    authorUsername: 'example1',
    authorName: 'User Example 1',
  },
  {
    body: 'Example Post 2',
    authorId: mongoose.Types.ObjectId(),
    authorUsername: 'example2',
    authorName: 'User Example 2',
  },
];

module.exports = { initialUsers, initialPosts };
