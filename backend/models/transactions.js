/* MIGHT BUILD LATER


// models/trasactions.js 
//// ./backend/models/transactions.js

const mongoose = require('mongoose');

/**
 * Transaction Schema Definition.
 * Defines the schema for the Transaction model, including field types and requirements.
 *//*
const transactionSchema = new mongoose.Schema({
  // Reference to the User model to associate the transaction with a user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  // Amount involved in the transaction
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
  },
  // Type of transaction (e.g., deposit, withdrawal, transfer)
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
  },
  // Description or note about the transaction
  description: {
    type: String,
  },
  // Date and time when the transaction occurred
  date: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Creates the Transaction model based on the defined schema.
 *//*
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

*/