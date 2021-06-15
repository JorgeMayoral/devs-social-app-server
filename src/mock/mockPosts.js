const dotenv = require('dotenv');

// DB Config
const connectDB = require('../config/db');

// Model
const { Post } = require('../models/Post.model');
const { User } = require('../models/User.model');

// Data
const postsMockData = require('./mock_posts.json');
const usersMockData = require('./mock_users.json');

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

  console.log('Mocking data...');

  for (let i = 0; i < postsMockData.length; i++) {
    await savePost(usersMockData[i], postsMockData[i]);
  }

  console.log('All mock posts has been created!');

  process.exit(0);
}

main();
