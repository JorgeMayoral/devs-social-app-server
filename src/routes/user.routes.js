const { Router } = require('express');

// Controllers
const {
  register,
  login,
  getUsers,
  getUserById,
} = require('./../controllers/user.controller');

const router = Router();

// Routes
router.route('/login').post(login);
router.route('/all').get(getUsers);
router.route('/:id').get(getUserById);
router.route('/').post(register);

module.exports = router;
