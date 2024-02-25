// validationMiddleware.js 
// ./backend/middlewares/validationMiddleware.js

/**
 * Middleware to validate user input for certain routes.
 * Ensures that the required fields for user operations are present.
 * 
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @param {Function} next - The next middleware function in the stack.
 */
function validateUser(req, res, next) {
    // Define the list of required fields
    const requiredFields = ['email', 'password'];
    
    // Check for missing fields
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    // If there are missing fields, return an error response
    if (missingFields.length > 0) {
        const missingFieldsList = missingFields.join(', ');
        return res.status(400).json({
            message: `Missing required fields: ${missingFieldsList}`
        });
    }
    
    // If all required fields are present, proceed to the next middleware
    next();
}

module.exports = { validateUser };