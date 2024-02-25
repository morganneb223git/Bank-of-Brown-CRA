/**
 * userController.js
 * ./backend/controllers/userController.js
 * 
 * Controller for managing user-related routes, including secure data access and transaction management.
 * Utilizes middleware for authentication and validation to ensure data integrity and security.
 */

const express = require('express');
const router = express.Router();

// Middleware imports
const { authenticateToken } = require('../middlewares/authMiddleware.js');
const { validateUser } = require('../middlewares/validationMiddleware.js');

// Data access layer import
const dal = require('../dal.js');

/**
 * GET /secure-data
 * Retrieves secure data only accessible by authenticated and validated users.
 * 
 * @middleware validateUser - Validates the user's request format and parameters.
 * @middleware authenticateToken - Verifies the user's authentication token.
 * 
 * @returns {Object} Secure data response.
 */
router.get('/secure-data', validateUser, authenticateToken, (req, res) => {
    res.json({ message: 'Secure data' });
});

/**
 * GET /
 * Retrieves all transactions for a validated user.
 * 
 * @middleware validateUser - Validates the user's request format and parameters.
 * 
 * @returns {Array} List of all transactions.
 */
router.get('/', validateUser, async (req, res) => {
    try {
        const transactions = await dal.getAllTransactions();
        res.json(transactions);
    } catch (error) {
        console.error('Error getting transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * POST /
 * Creates a new transaction for a validated user.
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
        const newTransaction = await dal.createTransaction(amount, description);
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;