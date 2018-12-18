const { validationResult } = require('express-validator/check');
var fs = require("fs");
var slash = require('slash');

const Post = require('../models/post');

// CREATE A POST *************************************/
exports.createPost = (req, res, next) => {
  console.log('dddd')
  const errors = validationResult(req);
 
  if (!errors.isEmpty()) {
    const error = new Error('validation failed');
    error.statusCode = 422;
    throw error;
  }
  
  if (!req.file) {
    const error = new Error('no image provided');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  console.log(imageUrl)
  // const imageUrl = 'req.file.path';

  // get params and wrap them
  const title = req.body.title;
  const content = req.body.content;
  const post = Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: 'Alon' }
  });
console.log('aaa',{
  title: title,
  content: content,
  imageUrl: imageUrl,
  creator: { name: 'Alon' }
});
  // save user data
  post.save()
    .then(result => {
      //create db post
      res.status(201).json({
        massage: 'success',
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });


};


// GET POSTS ******************************************/
exports.getPost = (req, res, next) => {
  
  const postId = req.params.postId;
  console.log(postId)
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('could not find post');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        massage: 'post fetched',
        post: post
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

// GET POSTS
exports.getPosts = (req, res, next) => {
  console.log('zzz')
  Post.find()
    .then(posts => {
      res.status(200).json({
        massage: 'posts fetched',
        posts: posts
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

// VIDEOS *************************************/
var dirname = __dirname;
if (process.platform === 'win32') dirname = slash(dirname);
global.__base = dirname + '/';


exports.getVideos = (req, res, next) => {
  console.log('zzz')
  let contents = fs.readFileSync(dirname + "/../db/mostpopular.api.json");
  res.status(200).json(JSON.parse(contents))
}