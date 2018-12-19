const path = require('path');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var slash = require('slash');

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const app = express();

// FILE UPLOAD HANDLER ***************************/
var dirname = __dirname;
if (process.platform === 'win32') dirname = slash(dirname);
global.__base = dirname + '/';

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    // on win os add
    //.replace(/:/g, '-')
    cb(null, new Date().toString().replace(/[:,-, ]/g, '_') + '-' + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/PNG' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
/*************************************************/

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('images',
  express.static(path.join(__dirname, 'images'))
  );

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// error handler 
app.use((error, req, res, next) => {
  // console.trace()
  const status = error.statusCode || 500;
  const massage = error.massage;
  const data = error.data;
  console.log('*******************************************************************************error****************************************************************************************************************', error.statusCode, error)
  res.status(status).json({ massage: massage, data: data });
});

mongoose
  .connect('mongodb://127.0.0.1:27017')
  // .connect('mongodb+srv://root:root@cluster0-8o3kc.mongodb.net/massages?retryWrites=true')
  .then(result => {
    app.listen(8000);
  })
  .catch(err => console.log('err'));