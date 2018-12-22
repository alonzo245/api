const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var videoSchema = new Schema({
  video: Object
},
  {
    timestamps: true
  }
);


module.exports = mongoose.model('Video', videoSchema);

