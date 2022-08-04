const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjYyZGYxNmVmNmVmZWUxOGFiODRlYzZjMCIsInVzZXJuYW1lIjoiYWxleDE1IiwiZW1pYWwiOiJhbGV4MTVAZ21haWwuY29tIn0sImlhdCI6MTY1ODc4ODE1MSwiZXhwIjoxNjU4NzkxNzUxfQ.sHa6EBupZqEEDJAq-5x69hVZAQAuM9nK3nsnbm1_cE0'
    const token = req.headers.authorization?.split(' ')[1];
    const verified = jwt.verify(token, "secretkey123");
    req.verifiedUser = verified.user;
    next();
  } catch (error) {
    next();
  }
}

module.exports = {
  authenticate
}