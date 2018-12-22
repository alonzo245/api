const express = require('express');
const router = express.Router();
// incomming parameters validation
const { body } = require('express-validator/check');
const videoFeedController = require('../controllers/video-feed');
const isAuth = require('../middleware/is-auth');

// GET
router.get('/videos', videoFeedController.getVideos);

module.exports = router;
