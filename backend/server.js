// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const express = require('express');
const cors = require('cors'); // CORS middleware for handling cross-origin requests
const helmet = require('helmet'); // Helmet helps secure Express apps by setting various HTTP headers
const bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware
const mongoose = require('mongoose'); // MongoDB object modeling tool
const rateLimit = require('express-rate-limit'); // Basic rate-limiting middleware
const { errorHandler } = require('./middlewares/errorMiddleware'); // Custom error handling middleware
const accountRouter = require('./controllers/accountController'); // Router for account-related routes
const userRouter = require('./controllers/userController'); // Router for user-related routes
const transactionRouter = require('./controllers/transactionController'); // Router for transaction-related routes
const fs = require('fs'); // File system module for reading SSL certificate files
const https = require('https'); // HTTPS module for HTTPS server
const http = require('http'); // HTTP module for HTTP server

const app = express();

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Enhance API's security with Helmet
app.use(bodyParser.json()); // Support JSON-encoded bodies

// Rate limiting setup to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Define routes using the imported routers
app.use('/account', accountRouter);
app.use('/users', userRouter);
app.use('/transactions', transactionRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));
  
// Apply the custom error handling middleware
app.use(errorHandler);

// Environment-specific network configuration
const PORT = process.env.PORT || 5000; // Default to port 5000 if no PORT env var is specified
const isProduction = process.env.NODE_ENV === 'production'; // Check if the environment is production

if (isProduction) {
  // If in production, create an HTTPS server
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH), // Path to SSL key
    cert: fs.readFileSync(process.env.SSL_CERT_PATH), // Path to SSL certificate
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
} else {
  // If not in production (e.g., in development), create an HTTP server
  http.createServer(app).listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
  });
}