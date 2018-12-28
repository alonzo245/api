
var mongoose = require('mongoose')
var assert = require('assert')
var data = require('./db/mostpopular.api.json')
// var data = require('./db/trandingil.json')
// mongoose.connect('mongodb://localhost/flix_api');
mongoose.connect('mongodb+srv://root:root@cluster0-8o3kc.mongodb.net/flix_api?retryWrites=true');

// console.log(data.items[1])
var Schema = mongoose.Schema
var videoSchema = new Schema({
  video: Object
},
  {
    timestamps: true
  }
);

// var Video = mongoose.model('Alonsvideo', videoSchema)
var Video = mongoose.model('Video', videoSchema)

data.items.map((videoObj) => {
  // console.log(video);
  let video = new Video({
    video: videoObj
  });
  video.save();
  return;
})


// Video.collection.insertMany(data, (err, r) => {
//   console.log('****************',err)
//   assert.equal(null, err);
//   assert.equal(3, r.insertedCount);
//   db.close();
// })

// const user = new User({
//   email: email,
//   password: hashedPw,
//   name: name
// });
// return user.save();

//GET ************************************************************/
// fetch('http://localhost:8000/feed/posts')
//   .then(r => r.json())
//   .then(data => console.log(data))
//   .catch(e => console.log("Booo"));

//POST ************************************************************/
// fetch('http://localhost:8000/feed/post', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     title: 'aaaa',
//     content: 'ddd'
//   })
// }).then(r => {
//   return r.json();
// })
//   .then(data => console.log(data))
//   .catch(e => console.log(e));
//******************************************************************/