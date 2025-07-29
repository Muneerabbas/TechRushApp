// middleware/error.js

const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging purposes
  logger.error(err.stack);

  // Send a generic server error response to the client
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};

// Make sure to export the function
module.exports = errorHandler;