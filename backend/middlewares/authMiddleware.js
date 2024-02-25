/// authMiddleware.js
// ./backend/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

/**
 * Middleware to authenticate requests based on JWT.
 * 
 * @param {Object} req - The request object from Express.
 * @param {Object} res - The response object from Express.
 * @param {Function} next - The next middleware function in the stack.
 */
function authenticateToken(req, res, next) {
    // Extract the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If no token is found, return a 401 Unauthorized response
    if (!token) {
        return res.status(401).json({ message: "Token not provided." });
    }

    // Verify the token
    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            // If token verification fails, return a 401 Unauthorized response
            return res.status(401).json({ message: "Invalid token." });
        }

        // If verification is successful, attach the user to the request object
        req.user = user;
        next(); // Proceed to the next middleware/route handler
    });
}

module.exports = { authenticateToken };