const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator/check');
var slash = require('slash');

const redis = require('redis');
const client = redis.createClient();
client.on('error', (err) => {
  console.log("Error " + err);
});


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


  console.time("GET VIDEOS");
  console.time(`GET VIDEOS_REDIS video_${currentCategoy}`);
  /////////////////////////////////////////////
  return client.get(`video_${currentCategoy}`, (err, result) => {
    // If that key exist in Redis store
    if (result) {
      const resultJSON = JSON.parse(result);
      console.timeEnd(`GET VIDEOS_REDIS video_${currentCategoy}`, result);
      return res.status(200).json(resultJSON);
    } else {
      // Key does not exist in Redis store
      // Fetch directly from Wikipedia API
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

          db_result = {
            massage: 'videos fetched',
            videos: videos,
            totlaItems: totalItems
          };

          client
            .setex(`video_${currentCategoy}`,
              86400,
              JSON.stringify({
                ...db_result,
              }));

          res.status(200).json(db_result)
          console.timeEnd("GET VIDEOS");
        })
        .catch(err => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    }
  });
  /////////////////////////////////////////////
}
