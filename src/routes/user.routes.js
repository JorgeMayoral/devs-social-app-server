const { Router } = require('express');

// Controllers
const { register } = require('./../controllers/user.controller');

const router = Router();

// Routes
router.route('/').post(register);

module.exports = router;
