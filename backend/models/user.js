const mongoose = require('mongoose');

/**
 * User Schema Definition.
 * Defines the schema for the User model, including field types, requirements, and default values.
 */
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  // User's email address
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Simple regex for email validation
  },
  // User's password (hashed)
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  // User's account balance with a default value of 0
  balance: {
    type: Number,
    default: 0,
  },
  // Type of account (e.g., savings, checking)
  accountType: {
    type: String,
    required: [true, 'Account type is required'],
  },
  // Unique account number for the user
  accountNumber: {
    type: String,
    required: [true, 'Account number is required'],
    unique: true,
  },
  // User's phone number
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  // New role field
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'bank employee'], // Example roles
    default: 'user', // Default role
  },
});

/**
 * Creates the User model based on the defined schema.
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
