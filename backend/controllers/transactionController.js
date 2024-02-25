/**
 * transactionController.js
 * ./backend/controllers/transactionController.js
 * 
 * Controller for handling transaction-related routes. It includes functionalities
 * for retrieving secure data, fetching all transactions, and creating new transactions.
 * It utilizes middleware for authentication and validation to ensure the security
 * and integrity of transactions.
 */

const express = require('express');
const router = express.Router();

// Middleware imports for authentication and validation
const { authenticateToken } = require('../middlewares/authMiddleware.js');
const { validateUser } = require('../middlewares/validationMiddleware.js');

// Data Access Layer (DAL) import for database operations
const dal = require('../dal.js');

/**
 * GET /secure-data
 * A secure route that returns a generic message. This route is protected
 * by both validateUser and authenticateToken middleware to ensure that
 * only authenticated and valid users can access it.
 * 
 * @middleware validateUser - Validates the user's request format and parameters.
 * @middleware authenticateToken - Verifies the user's authentication token.
 * 
 * @returns {Object} A JSON object containing a secure message.
 */
router.get('/secure-data', validateUser, authenticateToken, (req, res) => {
    res.json({ message: 'Secure data' });
});

/**
 * GET /
 * Retrieves all transactions available in the database. This route applies
 * validateUser middleware to ensure the request is from a valid user.
 * 
 * @middleware validateUser - Validates the user's request format and parameters.
 * 
 * @returns {Array} A JSON array of all transactions.
 */
router.get('/', validateUser, async (req, res) => {
    try {
        // Retrieves all transactions from the DAL
        const transactions = await dal.getAllTransactions();
        // Responds with the retrieved transactions
        res.json(transactions);
    } catch (error) {
        // Logs the error to the console and responds with a 500 status code
        console.error('Error getting transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * POST /
 * Creates a new transaction in the database. This route is protected by the
 * validateUser middleware to ensure the request comes from a valid user.
 * 
 * @middleware validateUser - Validates the user's request format and parameters.
 * 
 * @param {number} amount - The amount for the transaction.
 * @param {string} description - The description of the transaction.
 * 
 * @returns {Object} The newly created transaction.
 */
router.post('/', validateUser, async (req, res) => {
    const { amount, description } = req.body;
    try {
        // Creates a new transaction using the DAL
        const newTransaction = await dal.createTransaction(amount, description);
        // Responds with the newly created transaction and a 201 status code
        res.status(201).json(newTransaction);
    } catch (error) {
        // Logs the error to the console and responds with a 500 status code
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Exports the router to be used in other parts of the application
module.exports = router;