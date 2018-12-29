const path = require('path');
const fs = require('fs');
// const https = require('https');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var slash = require('slash');
var helmet = require('helmet');
// var compression = require('compression');
var morgan = require('morgan');
const debug = require('debug')('my-namespace')
// const winston = require('winston')

const feedRoutes = require('./routes/feed');
const videoFeedRoutes = require('./routes/video-feed');
const authRoutes = require('./routes/auth');

// mainly for loggin personal modules
const name = 'my-app'
debug('booting %s', name)
// winston.log('info', 'Hello log files!', {
//   someKey: 'some-value'
// })

const app = express();

//SSL Configuration + not working in production
// const privatKey = fs.readFileSync('server.key');
// const certification = fs.readFileSync('server.cert')

app.use(helmet());
// mainly for websites and not apis + not working on heroku
// app.use(compression());

// loggin for incoming requests
const accessLoStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLoStream }));

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

console.log('***************')
app.use('/video-feed', videoFeedRoutes);
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// error handler 
app.use((error, req, res, next) => {
  // console.trace()
  const status = error.statusCode || 500;
  const massage = error.massage;
  const data = error.data;
  res.status(status).json({ massage: massage, data: data });
});

const dbs = {
  flixApi: "flix_api"
}
mongoose
.connect(process.env.MONGO_CONNECTION + dbs.flixApi + "?retryWrites=true")
  .then(result => {
    // for local testing HTTPS
    // https.createServer({ key: privatKey, cert: certification }, app)
    //.listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 8000);
  })
  .catch(err => console.log('err'));