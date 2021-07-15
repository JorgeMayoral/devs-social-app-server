const asyncHandler = require('express-async-handler');

const {
  registration,
  loginUser,
  findAllUsers,
  findUserById,
  follow,
  update,
  remove,
  profile,
} = require('./../services/user.service');

const { generateToken } = require('./../utils/jwt');

/**
 * @name Register
 * @description Register a new user
 * @access Public
 * @route POST /api/v1/user
 */
const register = asyncHandler(async (req, res) => {
  const { username, name, email, password } = req.body;

  if (!username || !name || !email || !password) {
    res.status(400);
    throw new Error('User data missing');
  }

  const response = await registration(username, name, email, password);

  if (response.error) {
    res.status(401);

    throw new Error(response.error);
  } else {
    const token = generateToken(response.id);

    response.token = token;

    res.status(201);
    res.json(response);
  }
});

/**
 * @name Login
 * @description Login user
 * @access Public
 * @route POST /api/v1/user/login
 */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Username or Password missing');
  }

  const response = await loginUser(username, password);

  if (response.error) {
    res.status(401);

    throw new Error(response.error);
  } else {
    const token = generateToken(response.id);

    response.token = token;

    res.status(200);
    res.json(response);
  }
});

/**
 * @name Get Users
 * @description Get all users without email and password
 * @access Public
 * @route GET /api/v1/user/all
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await findAllUsers();
  res.status(200);
  res.json(users);
});

/**
 * @name Get User by Id
 * @description Get user by Id without email and password
 * @access Public
 * @route GET /api/v1/user/:id
 */
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error('User ID not provided');
  }

  const response = await findUserById(id);

  if (response.error) {
    res.status(404);
    throw new Error(response.error);
  }

  res.status(200);
  res.json(response);
});

/**
 * @name Follow User
 * @description Follow a user / Unfollow if it is already followed
 * @access Private
 * @route PUT /api/v1/user/:id/follow
 */
const followUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const userId = req.user._id;

  if (!userId) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  if (!targetId) {
    res.status(400);
    throw new Error('Missing target ID');
  }

  const response = await follow(userId, targetId);

  if (response.error) {
    res.status(404);
    throw new Error(response.error);
  }

  res.status(202);
  res.json(response);
});

/**
 * @name Update User
 * @description Update logged User
 * @access Private
 * @route PUT /api/v1/user/update
 */
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const name = req.body.name || req.user.name;
  const email = req.body.email || req.user.email;

  const response = await update(userId, { name, email });

  if (response.error) {
    res.status(400);
    throw new Error(response.error);
  }

  res.status(200);
  res.json(response);
});

/**
 * @name Delete User
 * @description Delete logged user
 * @access Private
 * @route DELETE /api/v1/user/delete
 */
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const response = await remove(userId);

  if (response.error) {
    res.status(404);
    throw new Error(response.error);
  }

  res.status(204);
  res.json(response);
});

/**
 * @name Profile
 * @description Return information about the current logged user
 * @access Private
 * @route GET /api/v1/user/profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const response = await profile(userId);

  if (response.error) {
    res.status(400);
    throw new Error('User not found');
  }

  res.status(200);
  res.json(response);
});

module.exports = {
  register,
  login,
  getUsers,
  getUserById,
  followUser,
  updateUser,
  deleteUser,
  getProfile,
};
