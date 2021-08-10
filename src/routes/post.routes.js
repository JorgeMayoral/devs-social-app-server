const { Router } = require('express');

// Controllers
const {
  createPost,
  getPosts,
  getPostById,
  likePost,
  updatePost,
  deletePost,
  timeline,
} = require('./../controllers/post.controller');

// Middleware
const { protect } = require('./../middleware/auth.middleware');

const router = Router();

// Routes
router.route('/all').get(getPosts);
router.route('/timeline').get(protect, timeline);
router
  .route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);
router.route('/:id/like').put(protect, likePost);
router.route('/').post(protect, createPost);

module.exports = router;
