const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const { validationResult } = require('express-validator/check');
var slash = require('slash');

const Post = require('../models/post');

// CREATE A POST *************************************/
exports.createPost = (req, res, next) => {
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
  const title = req.body.title;
  const content = req.body.content;
  let creator;

  const post = Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });

  post.save()
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        massage: 'success',
        post: result,
        // for testing in postman
        creator: { _id: creator._id, name: "alon alush" }
        // creator: { _id: creator._id, name: creator.name }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });


};


// DELETE POST ******************************************/
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      // check logged
      if (!post) {
        const error = new Error('could not find post');
        error.statusCode = 404;
        throw error;
      }
      
      if (post.creator.toString() !== req.userId) {
        const error = new Error('not authorized');
        error.statusCode = 403;
        throw error;
      }

      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      user.pull(postId);
      return user.save();
    })
    .then(result => {
      res.status(200).json({
        massage: 'post deleted'
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

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
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
      res.status(200)
        .json({ massage: 'posts fetched', posts: posts, totlaItems: totalItems })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

// PUT ****************************************/
exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('validation failed');
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.imageUrl;

  if (req.file) {
    imageUrl = req.file.path;
  }
  
  if (!imageUrl) {
    const error = new Error('no file picked');
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('could not find post');
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error('not authorized');
        error.statusCode = 403;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then(result => {
      res.status(200).json({ massage: 'post updated', post: result })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
//DELETE IMAGE HELPER
const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
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