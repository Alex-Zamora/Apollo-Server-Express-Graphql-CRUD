const jwt = require('jsonwebtoken');

const createJWTToken = user => {
  return jwt.sign({ user }, 'secretkey123', {
    expiresIn: '1d'
  });
}

module.exports = {
  createJWTToken
}