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
    res.status(201).json({
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

module.exports = {
  register,
};
