const { Router } = require('express');

// Controllers
const {
  register,
  login,
  getUsers,
  getUserById,
  followUser,
  updateUser,
  deleteUser,
} = require('./../controllers/user.controller');

const router = Router();

// Routes
router.route('/login').post(login);
router.route('/all').get(getUsers);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);
router.route('/:id/follow').put(followUser);
router.route('/').post(register);

module.exports = router;
