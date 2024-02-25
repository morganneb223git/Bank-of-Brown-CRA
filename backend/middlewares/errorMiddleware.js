// errorMiddleware.js
//./backend/middlewares/errorMiddleware.js

/**
 * Custom error class for handling validation errors.
 */
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400; // HTTP status code for Bad Request
    }
}

/**
 * Custom error class for handling not found errors.
 */
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404; // HTTP status code for Not Found
    }
}

/**
 * Express error handling middleware.
 * This function captures errors thrown from anywhere in the application,
 * checks their type, and sends an appropriate HTTP response.
 * 
 * @param {Error} err - The error object.
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @param {Function} next - The next middleware function in the stack.
 */
function errorHandler(err, req, res, next) {
    // Log the error stack for debugging purposes
    console.error(err.stack);
    
    // Check if the response headers have already been sent
    if (res.headersSent) {
        // If headers have been sent, delegate to the default Express error handler
        return next(err);
    }

    // Extract the status code from the error, or default to 500 for internal server errors
    const statusCode = err.statusCode || 500;

    // Prepare the error response object
    const errorResponse = {
        error: {
            name: err.name,
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Include stack trace in development mode for debugging
        }
    };

    // Send the error response with the appropriate status code
    res.status(statusCode).json(errorResponse);
}

module.exports = { errorHandler, ValidationError, NotFoundError };