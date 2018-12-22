const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var alonsVideoSchema = new Schema({
  video: Object
},
  {
    timestamps: true
  }
);


module.exports = mongoose.model('Alonsvideo', alonsVideoSchema);

