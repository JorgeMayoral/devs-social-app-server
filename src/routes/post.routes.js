const { Router } = require('express');

// Controllers
const {
  createPost,
  getPosts,
  getPostById,
  likePost,
} = require('./../controllers/post.controller');

const router = Router();

// Routes
router.route('/all').get(getPosts);
router.route('/:id').get(getPostById);
router.route('/:id/like').put(likePost);
router.route('/').post(createPost);

module.exports = router;
