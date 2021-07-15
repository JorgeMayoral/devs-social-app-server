const asyncHandler = require('express-async-handler');

const { User } = require('./../models/User.model');

const registration = asyncHandler(async (username, name, email, password) => {
  const emailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });

  if (emailExists || usernameExists) {
    return { error: 'User already exists' };
  }

  const user = await User.create({
    username,
    name,
    email,
    password,
  });

  const data = {
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    posts: user.posts,
    likes: user.likes,
    followers: user.followers,
    following: user.following,
  };

  return data;
});

const loginUser = asyncHandler(async (username, password) => {
  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    const data = {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      posts: user.posts,
      likes: user.likes,
      followers: user.followers,
      following: user.following,
    };

    return data;
  } else {
    return { error: 'Invalid username or password' };
  }
});

const findAllUsers = asyncHandler(async () => {
  let users = await User.find({}).select(['-email', '-password']);

  users = users.map((user) => user.renameId());

  return users;
});

const findUserById = asyncHandler(async (id) => {
  let user = await User.findById(id).select(['-email', '-password']);

  if (user) {
    user = user.renameId();

    return user;
  } else {
    return { error: 'User not found' };
  }
});

const follow = asyncHandler(async (userId, targetId) => {
  const targetUser = await User.findById(targetId).select([
    '-email',
    '-password',
  ]);

  if (!targetUser) {
    return { error: 'Target user not found' };
  }

  const user = await User.findById(userId).select(['-email', '-password']);

  if (!user) {
    return { error: 'User not found' };
  }

  if (
    targetUser.followers.includes(userId) ||
    user.following.includes(targetId)
  ) {
    // Unfollow if the user already follows the target
    targetUser.followers = targetUser.followers.filter(
      (f) => !f.equals(user._id),
    );
    user.following = user.following.filter((f) => !f.equals(targetUser._id));
  } else {
    // Follow if the user are not following the target
    targetUser.followers.push(user._id);
    user.following.push(targetUser._id);
  }

  await targetUser.save();
  await user.save();

  return targetUser;
});

const update = asyncHandler(async (userId, userData) => {
  const { name, email } = userData;
  const user = await User.findById(userId);

  if (!user) {
    return { error: 'User not found' };
  }

  const emailExists = await User.findOne({ email });

  if (user.email !== email && emailExists) {
    return { error: 'Username or email already taken' };
  }

  user.name = user.name !== name ? name : user.name;
  user.email = user.email !== email ? email : user.email;

  await user.save();

  return {
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    posts: user.posts,
    likes: user.likes,
    followers: user.followers,
    following: user.following,
  };
});

const remove = asyncHandler(async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    return { error: 'User not found' };
  }

  // TODO: implement delete posts from user

  await user.remove();

  return { message: 'User deleted' };
});

const profile = asyncHandler(async (userId) => {
  const user = await User.findById(userId).select(['-password']);

  if (!user) {
    return { error: 'User not found' };
  }

  return user;
});

module.exports = {
  registration,
  loginUser,
  findAllUsers,
  findUserById,
  follow,
  update,
  remove,
  profile,
};
