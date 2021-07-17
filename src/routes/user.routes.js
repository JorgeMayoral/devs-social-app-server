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
  getProfile,
} = require('./../controllers/user.controller');

// Middleware
const { protect } = require('./../middleware/auth.middleware');

const router = Router();

// Routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/all').get(getUsers);
router.route('/profile').get(protect, getProfile);
router.route('/update').put(protect, updateUser);
router.route('/delete').delete(protect, deleteUser);
router.route('/:id').get(getUserById);
router.route('/:id/follow').put(protect, followUser);

module.exports = router;
