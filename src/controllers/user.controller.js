const { User } = require('./../models/User.model');

/**
 * @name Register
 * @description Register a new user
 * @access Public
 * @route POST /api/v1/user
 */
const register = async (req, res) => {
  const { username, name, email, password } = req.body;

  const emailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });

  if (emailExists || usernameExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    name,
    email,
    password,
  });

  if (user) {
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.name = user.name;
    res.status(201).json({
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      posts: user.posts,
      likes: user.likes,
      followers: user.followers,
      following: user.following,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

/**
 * @name Login
 * @description Login user
 * @access Public
 * @route POST /api/v1/user/login
 */
const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.name = user.name;
    res.status(200).json({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      posts: user.posts,
      likes: user.likes,
      followers: user.followers,
      following: user.following,
    });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
};

/**
 * @name Get Users
 * @description Get all users without email and password
 * @access Public
 * @route GET /api/v1/user/all
 */
const getUsers = async (req, res) => {
  const users = await User.find({}).select(['-email', '-password']);
  res.status(200).json(users);
};

/**
 * @name Get User by Id
 * @description Get user by Id without email and password
 * @access Public
 * @route GET /api/v1/user/:id
 */
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select([
    '-email',
    '-password',
  ]);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('ERROR: User not found');
  }
};

/**
 * @name Follow User
 * @description Follow a user / Unfollow if it is already followed
 * @access Private
 * @route PUT /api/v1/user/:id/follow
 */
const followUser = async (req, res) => {
  const userId = req.session.userId;
  const targetId = req.params.id;

  if (!userId) {
    res.status(401);
    throw new Error('ERROR: Unauthorized');
  }

  const targetUser = await User.findById(targetId);

  if (!targetUser) {
    res.status(404);
    throw new Error('ERROR: User not found');
  }

  const user = await User.findById(userId);

  if (
    targetUser.followers.includes(userId) ||
    user.following.includes(targetId)
  ) {
    targetUser.followers = targetUser.followers.filter((f) => f != userId);
    user.following = user.following.filter((f) => f != targetId);
  } else {
    targetUser.followers = [userId, ...targetUser.followers];
    user.following = [targetId, ...user.following];
  }

  await targetUser.save();
  await user.save();

  res.status(202).json(targetUser);
};

module.exports = {
  register,
  login,
  getUsers,
  getUserById,
  followUser,
};
