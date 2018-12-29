const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator/check');
var slash = require('slash');


// GET VIDEOS
exports.getVideos = (req, res, next) => {

  switch (req.query.category) {
    case 'alonsvideos':
      currentCategoy = 'alonsvideo';
      break;
    default:
    case 'mostpopular':
      currentCategoy = 'video';
  }
  const Video = require('../models/' + currentCategoy);

  const currentPage = req.query.page || 1;
  const perPage = req.query.items || 15;
  let totalItems;
  console.timeS("GET VIDEOS");
  Video.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Video.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
      // .sort({createdAt: 'DESC'});
    })
    .then(videos => {
      result = {
        massage: 'videos fetched',
        videos: videos,
        totlaItems: totalItems
      };

      res.status(200).json(result)
      console.timeEnd("GET VIDEOS");
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });


  /////////////////////////////////////////////
}
