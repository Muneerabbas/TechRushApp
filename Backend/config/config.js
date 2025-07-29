const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/campuspay',
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key',
  env: process.env.NODE_ENV || 'development',
};