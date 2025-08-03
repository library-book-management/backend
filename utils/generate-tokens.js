require('dotenv').config();
const jwt = require('jsonwebtoken');


const generateAccessToken = (user) => {
    const token = jwt.sign(user, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
      });
    
      return token;
};

const generateRefreshToken = (user) => {
    const token = jwt.sign(user, process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
      });
    
      return token;
};
  

module.exports = { generateAccessToken, generateRefreshToken };
