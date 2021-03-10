const { Router } = require('express');

// Controllers
const { register, login } = require('./../controllers/user.controller');

const router = Router();

// Routes
router.route('/login').post(login);
router.route('/').post(register);

module.exports = router;
