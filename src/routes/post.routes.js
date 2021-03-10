const { Router } = require('express');

// Controllers
const { createPost } = require('./../controllers/post.controller');

const router = Router();

// Routes
router.route('/').post(createPost);

module.exports = router;
