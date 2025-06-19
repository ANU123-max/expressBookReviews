const jwt = require('jsonwebtoken');
const SECRET = 'jwtsecret';

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    res.status(403).send('Unauthorized');
  }
};
