/**
 * accountController.js
 * ./backend/controllers/accountController.js
 * 
 * This controller handles routing for user account operations including creation,
 * authentication, retrieval, updating, and transaction operations like deposits and withdrawals.
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dal = require('../dal.js'); // Data Access Layer for database operations
const saltRounds = 10; // Configuration for bcrypt password hashing

/**
 * POST /create
 * Route to create a new user account. It checks if the user already exists, hashes the password,
 * and then creates the user in the database.
 */
router.post('/create', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const users = await dal.find(email);
        if (users.length > 0) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await dal.create({ name, email, password: hashedPassword, accountNumber });

        res.status(201).json({ message: 'Account successfully created', user }); // No need to separately add accountNumber here
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




/**
 * POST /login
 * Authenticates a user by comparing the provided password with the hashed password stored in the database.
 * On successful authentication, generates a JWT token for the session.
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await dal.find(email);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = users[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({ message: 'Authentication failed' });
            }
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            res.setHeader('Authorization', 'Bearer ' + token);
            res.json({ message: 'Login successful', user: { email: user.email, name: user.name } });
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * POST /find
 * Finds user accounts by email. Returns an array of matching user accounts.
 */
router.post('/find', async (req, res) => {
    const { email } = req.body;
    try {
        const users = await dal.find(email);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users);
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * POST /findOne
 * Finds a single user account by email. Returns the user account details if found.
 */
router.post('/findOne', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await dal.findOne(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error finding one user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * POST /update
 * Updates user information for the specified email. Can update name and password.
 */
router.post('/update', async (req, res) => {
    const { email, name, password } = req.body;
    try {
        const updatedUser = await dal.update(email, { name, password });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User information updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * POST /deposit
 * Deposits a specified amount into the user's account identified by email.
 */
router.post('/deposit', async (req, res) => {
    const { email, amount } = req.body;
    try {
        const result = await dal.deposit(email, parseFloat(amount));
        if (!result) {
            return res.status(404).json({ message: 'User not found or deposit failed' });
        }
        res.json({ message: 'Deposit successful', balance: result.balance });
    } catch (error) {
        console.error('Error during deposit:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * POST /withdraw
 * Withdraws a specified amount from the user's account identified by email.
 */
router.post('/withdraw', async (req, res) => {
    const { email, amount } = req.body;
    try {
        const result = await dal.withdraw(email, parseFloat(amount));
        if (!result) {
            return res.status(404).json({ message: 'User not found or insufficient funds' });
        }
        res.json({ message: 'Withdrawal successful', balance: result.balance });
    } catch (error) {
        console.error('Error during withdrawal:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * GET /all
 * Retrieves all user accounts from the database.
 */
router.get('/all', async (req, res) => {
    try {
        const docs = await dal.all();
        res.json(docs);
    } catch (error) {
        console.error('Error retrieving all users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * GET /balance/:email
 * Retrieves the balance for a user's account identified by email.
 * Utilizes the findOne method to first locate the user.
 */
router.get('/balance/:email', async (req, res) => {
    const { email } = req.params;
    console.log(`Balance request received for email: ${email}`); // Log the email for which balance is requested

    try {
        // Use the findOne method to search for the user by email
        const user = await dal.findOne(email);
        console.log('User found:', user); // Log the user object found

        // If no user is found, respond with a 404 error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If the user is found, respond with the balance
        res.json({ message: 'Balance retrieval successful', balance: user.balance });
    } catch (error) {
        console.error('Error retrieving balance:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * GET /data
 * Retrieves user data based on the provided email.
 */
router.get('/data', async (req, res) => {
    const userEmail = req.query.email;
    try {
        const user = await dal.findUserByEmail(userEmail); // Use dal.findUserByEmail to retrieve user by email
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Endpoint to fetch user account information
router.get('/profile', async (req, res) => {
    const userEmail = req.query.email;
    console.log(`Profile request received for email: ${userEmail}`); // Log the email for which profile is requested

    try {
        // Use the findOne method to search for the user by email
        const userData = await dal.findOne(userEmail);
        console.log('User data found:', userData); // Log the user data found

        // If no user data is found, respond with a 404 error
        if (!userData) {
            return res.status(404).json({ message: 'User account information not found' });
        }

        // If user data is found, respond with the user data
        res.json(userData);
    } catch (error) {
        console.error('Error fetching user account information:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/update-profile', async (req, res) => {
    const { email, name, phoneNumber } = req.body;
  
    try {
      const user = await dal.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the user's name and phone number
      user.name = name;
      user.phoneNumber = phoneNumber;
  
      // Save the updated user object
      await user.save();
  
      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  /**
 * POST /createbank
 * Route to create a new bank account. It uses the user email to send new bank accout number and account type
 * then stores it under the user:email.
 */
router.post('/createbank', async (req, res) => {
    const { email, accountType } = req.body;

    try {
        const user = await dal.createBankAccount(email, accountType);
        res.status(200).json({ message: 'Bank account created successfully', user });
    } catch (error) {
        console.error('Error creating bank account:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

  

// Export the router for use in the main server file
module.exports = router;