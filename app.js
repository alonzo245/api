const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const feedRoutes = require('./routes/feed');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use('images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

// error handler 
app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const massage = error.massage;
  res.status(status).json({ massage: massage });
});

mongoose
  .connect('mongodb+srv://root:root@cluster0-8o3kc.mongodb.net/massages?retryWrites=true')
  .then(result => {
    app.listen(8000);
  })
  .catch(err => console.log('err'));