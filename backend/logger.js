const winston = require('winston');

// Define the Winston logger configuration
const logger = winston.createLogger({
  level: 'info', // Minimum level of messages to log
  format: winston.format.json(), // Log format
  transports: [
    // Console transport for logging to the console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Add colors to the console output
        winston.format.simple()    // Simple output format
      )
    }),
    // File transport for logging to a file
    new winston.transports.File({
      filename: 'error.log', // Log file path
      level: 'error',        // Log only error messages to file
      format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to log entries
        winston.format.json()      // Log in JSON format
      )
    })
  ]
});

// Export the configured logger instance
module.exports = logger;
