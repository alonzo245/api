const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    console.log('ddd')
    const error = new Error('not authenticated');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.APP_SECRET);
  } catch (err) {

    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    console.log('ddd')
    const error = new Error('user could not be found');
    //401 not authenticated
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
}