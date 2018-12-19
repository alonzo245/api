const express = require('express');
const router = express.Router();
// incomming parameters validation
const { body } = require('express-validator/check');
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

// GET
router.get('/post/:postId', isAuth, [
  body('postId').trim().isLength({ min: 3 })
], feedController.getPost);

// GET
router.get('/posts', isAuth, feedController.getPosts);


// PUT
router.put('/post/:postId', isAuth, [
  body('title').trim().isLength({ min: 3 }),
  body('content').trim().isLength({ min: 3 }),
], feedController.updatePost);

// POST 
router.post('/post', isAuth, [
  body('title').trim().isLength({ min: 3 }),
  body('content').trim().isLength({ min: 3 }),
], feedController.createPost);

// DELETE 
router.delete('/post/:postId', isAuth, feedController.deletePost);


// videos *********************************************/
router.get('/videos', isAuth, feedController.getVideos);

module.exports = router;
