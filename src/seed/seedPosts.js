const dotenv = require('dotenv');

// DB Config
const connectDB = require('../config/db');

// Model
const { Post } = require('../models/Post.model');
const { User } = require('../models/User.model');

// Data
const postsSeedData = require('./seed_posts.json');
const usersSeedData = require('./seed_users.json');

async function savePost(userData, postData) {
  console.log(`Creating post...`);
  const user = await User.findOne({ username: userData.username });
  const newPost = {
    body: postData.body,
    authorId: user._id,
    authorUsername: user.username,
    authorName: user.name,
  };
  const post = await Post.create(newPost);
  user.posts = [post._id, ...user.posts];
  await user.save();
  console.log(`Created post with id ${post._id} for user ${user.username}.`);
}

async function main() {
  console.log('Connecting to database...');

  dotenv.config();
  connectDB(process.env.MONGO_URI);

  console.log('Seeding database with posts...');

  for (let i = 0; i < postsSeedData.length; i++) {
    await savePost(usersSeedData[i], postsSeedData[i]);
  }

  console.log('All posts has been created!');

  process.exit(0);
}

main();
