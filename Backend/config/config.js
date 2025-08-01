module.exports = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/campuspay',
    jwtSecret: process.env.JWT_SECRET || 'your_secure_secret_key_12345',
    env: process.env.NODE_ENV || 'development',
  };