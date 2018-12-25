const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');
const authCtrl = require('../controllers/auth');

const router = express.Router();

router.post('/signup', [
  //CHECK ONE
  body('email')
    .isEmail()
    // .withMassage('please enter email')
    .custom((value, { req }) => {
      return User.findOne({ email: value })
        .then(userDoc => {
          if(userDoc){
            return Promise.reject('email already exist');
          }
        });
    })
    .normalizeEmail(),
  //CHECK TWO
  body('password').trim().isLength({ min: 3 }),
  //CHECK THREE
  body('name').trim().not().isEmpty()
],
  authCtrl.signup);

  router.post('/login', authCtrl.login);

module.exports = router;