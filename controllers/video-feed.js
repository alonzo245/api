const fs = require('fs');
const path = require('path');
const Video = require('../models/video');
const { validationResult } = require('express-validator/check');
var slash = require('slash');

// GET VIDEOS
exports.getVideos = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 50;
  let totalItems;
  Video.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      console.log(Video.find())
      return Video.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(videos => {
      // console.log('**************************************', videos)
      res.status(200)
        .json({ 
          massage: 'videos fetched', 
          videos: videos, 
          totlaItems: totalItems })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
