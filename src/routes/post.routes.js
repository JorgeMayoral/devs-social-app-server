const { Router } = require('express');

// Controllers
const {
  createPost,
  getPosts,
  getPostById,
} = require('./../controllers/post.controller');

const router = Router();

// Routes
router.route('/all').get(getPosts);
router.route('/:id').get(getPostById);
router.route('/').post(createPost);

module.exports = router;
