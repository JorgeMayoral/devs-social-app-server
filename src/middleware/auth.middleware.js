const asyncHandler = require('express-async-handler');

const { User } = require('./../models/User.model');
const { validateToken } = require('./../utils/jwt');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = validateToken(token);

      req.user = await User.findById(decoded.id).select(['-password']);

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized - Token failed.');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized - No token');
  }
});

module.exports = { protect };
