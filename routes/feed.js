const express = require('express');
const router = express.Router();
// incomming parameters validation
const { body } = require('express-validator/check');
const feedController = require('../controllers/feed');

// GET
router.get('/post/:postId', [
  body('postId').trim().isLength({ min: 3 })
],feedController.getPost);

// GET
router.get('/posts', feedController.getPosts);


// PUT
router.put('/post/:postId', [
  body('title').trim().isLength({ min: 3 }),
  body('content').trim().isLength({ min: 3 }),
], feedController.updatePost);

// POST 
router.post('/post', [
  body('title').trim().isLength({ min: 3 }),
  body('content').trim().isLength({ min: 3 }),
], feedController.createPost);


// videos *********************************************/
router.get('/videos', feedController.getVideos);

module.exports = router;
