// dal.js file ./backend/dal.js

// Load environment variables for MongoDB connection strings and other configurations.
require('dotenv').config();

// Import necessary modules.
const { MongoClient } = require('mongodb');
const logger = require('./logger'); // Winston or similar logger setup for logging messages.
const bcrypt = require('bcrypt');
const saltRounds = 10; // Salt rounds for bcrypt hashing.

// MongoDB URI and default database name from environment variables.
const url = process.env.MONGODB_URI;
const defaultDbName = process.env.DB_NAME;

// Global variables to hold the client and db instances to avoid reconnecting to MongoDB multiple times.
let db;
let client;

/**
 * Connects to MongoDB and initializes the db and client variables.
 * Reuses the connection if already established.
 * @returns {Object} An object containing the db and client instances.
 */
async function connectToMongo() {
    if (db) return { db, client };
    try {
        client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        db = client.db(defaultDbName);
        logger.info('Successfully connected to MongoDB.');
        return { db, client };
    } catch (error) {
        logger.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

/**
 * Retrieves the initialized db instance, ensuring connectToMongo has been called.
 * @returns {Object} The db instance.
 */
function getDb() {
    if (!db) throw new Error('DB not initialized. Call connectToMongo first.');
    return db;
}

// Below are the database operations: create, find, findOne, update, deposit, withdraw, and all.
// Each function is documented with jsdoc comments for clarity on parameters and return values.

/**
 * Inserts a new document into the specified collection.
 * @param {string} collectionName - The name of the collection.
 * @param {Object} document - The document to insert.
 * @returns {Promise<Object>} - The result of the insertion.
 */
async function createDocument(collectionName, document) {
    const { db } = await connectToMongo();
    try {
        const result = await db.collection(collectionName).insertOne(document);
        logger.info('Document inserted:', result.insertedId);
        return result;
    } catch (error) {
        logger.error('Failed to insert document:', error);
        throw error;
    }
}
  

  /**
   * Finds a document in a specified collection matching the given query.
   * @param {string} collectionName The name of the collection.
   * @param {Object} query The query to match documents.
   * @returns {Promise<Object|null>} The found document, or null if not found.
   */
  async function findDocument(collectionName, query) {
    const { db } = await connectToMongo();
    try {
      const document = await db.collection(collectionName).findOne(query);
      if (document) {
        logger.info('Document found:', document);
      } else {
        logger.info('No document matches the query.');
      }
      return document;
    } catch (error) {
      logger.error('Failed to find document:', error);
      throw error;
    }
  }
  
  /**
   * Updates a document in a specified collection matching the given query.
   * @param {string} collectionName The name of the collection.
   * @param {Object} query The query to match documents.
   * @param {Object} update The update operations to apply.
   * @returns {Promise<Object>} The result of the update operation.
   */
  async function updateDocument(collectionName, query, update) {
    const { db } = await connectToMongo();
    try {
      const result = await db.collection(collectionName).updateOne(query, { $set: update });
      if (result.matchedCount && result.modifiedCount) {
        logger.info('Document updated successfully.');
      } else {
        logger.info('No matching document found or no new data to update.');
      }
      return result;
    } catch (error) {
      logger.error('Failed to update document:', error);
      throw error;
    }
  }
  
  /**
   * Deletes a document from a specified collection matching the given query.
   * @param {string} collectionName The name of the collection.
   * @param {Object} query The query to match documents.
   * @returns {Promise<Object>} The result of the deletion operation.
   */
  async function deleteDocument(collectionName, query) {
    const { db } = await connectToMongo();
    try {
      const result = await db.collection(collectionName).deleteOne(query);
      if (result.deletedCount) {
        logger.info('Document deleted successfully.');
      } else {
        logger.info('No matching document found to delete.');
      }
      return result;
    } catch (error) {
      logger.error('Failed to delete document:', error);
      throw error;
    }
  }
  

/**
 * Creates a new user in the database.
 * @param {string} name User's name.
 * @param {string} email User's email.
 * @param {string} password User's password.
 * @returns The created user object.
 */
async function create({ name, email, password }) {
    try {
        const { db } = await connectToMongo();
        const collection = db.collection('users');

        // Generate an account number
        const accountNumber = Math.floor(Math.random() * 1000000000);

        const doc = {
            name,
            email,
            password,
            balance: 0,
            accountNumber,
            accountType: 'checking', // Assuming a default account type
            role: 'user' // Assuming a default role
        };

        const result = await collection.insertOne(doc);
        
        // Ensure the accountNumber is also returned as part of the result
        const insertedUser = {
            _id: result.ops[0]._id,
            name: result.ops[0].name, 
            email: result.ops[0].email, 
            password: result.ops[0].password, 
            balance: result.ops[0].balance,
            accountNumber,
            accountType: result.ops[0].accountType,
            role: result.ops[0].role
        };

        return insertedUser;
    } catch (err) {
        logger.error(`Error creating user: ${err.message}`, { stack: err.stack });
        throw err;
    }
}



/**
 * Finds users by email.
 * @param {string} email Email to search for.
 * @returns An array of user objects with the matching email.
 */
async function find(email) {
    try {
        const { db } = await connectToMongo();
        return db.collection('users').find({ email }).toArray();
    } catch (err) {
        logger.error(`Error finding user by email: ${err.message}`, { stack: err.stack });
        throw err;
    }
}

/**
 * Finds a single user by email.
 * @param {string} email Email to search for.
 * @returns A user object with the matching email or null.
 */
async function findOne(email) {
    try {
        const { db } = await connectToMongo();
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            throw new Error("User not found.");
        }
        return user;
    } catch (err) {
        logger.error(`Error finding one user by email: ${err.message}`, { stack: err.stack });
        throw err;
    }
}

/**
 * Updates a user's data.
 * @param {string} email Email of the user to update.
 * @param {Object} newData New data for the user.
 * @returns The updated user object.
 */
async function update(accountNumber, newData) {
  try {
    const { db } = await connectToMongo();
    const result = await db.collection('users').findOneAndUpdate(
      { accountNumber }, // Use accountNumber as the filter
      { $set: newData },
      { returnDocument: 'after' }
    );
    return result.value;
  } catch (err) {
    logger.error(`Error updating user data: ${err.message}`, { stack: err.stack });
    throw err;
  }
}

/**
 * Deposits an amount to a user's account.
 * @param {string} email Email of the user.
 * @param {number} amount Amount to deposit.
 * @returns The updated user object.
 */
async function deposit(email, amount) {
    try {
        const { db } = await connectToMongo();
        const result = await db.collection('users').findOneAndUpdate(
            { email },
            { $inc: { balance: amount } },
            { returnDocument: 'after' }
        );
        if (amount <= 0) {
            throw new Error("Amount must be positive.");
        }
        if (!result.value) {
            throw new Error("User not found.");
        }
        return result.value;
    } catch (err) {
        logger.error(`Error depositing amount: ${err.message}`, { stack: err.stack });
        throw err;
    }
}

/**
 * Withdraws an amount from a user's account.
 * @param {string} email Email of the user.
 * @param {number} amount Amount to withdraw.
 * @returns The updated user object.
 */
async function withdraw(email, amount) {
    try {
        const { db } = await connectToMongo();
        const user = await db.collection('users').findOne({ email });
        if (amount <= 0) {
            throw new Error("Amount must be positive.");
        }
        if (!user) {
            throw new Error("User not found.");
        }
        if (user.balance < amount) {
            throw new Error("Insufficient funds.");
        }
        const result = await db.collection('users').findOneAndUpdate(
            { email },
            { $inc: { balance: -amount } },
            { returnDocument: 'after' }
        );
        return result.value;
    } catch (err) {
        logger.error(`Error withdrawing amount: ${err.message}`, { stack: err.stack });
        throw err;
    }
}

/**
 * Retrieves all users from the database.
 * @returns An array of all user objects.
 */
async function all() {
    try {
        const { db } = await connectToMongo();
        return db.collection('users').find({}).toArray();
    } catch (err) {
        logger.error(`Error retrieving all users: ${err.message}`, { stack: err.stack });
        throw err;
    }
}

/**
 * Sets up the data access layer.
 * @param {string} uri MongoDB URI.
 * @param {string} dbName Database name.
 * @returns The database instance and a function to stop the database.
 */
async function setupDAL(uri, dbName) {
    return await connectToMongo(uri, dbName);
}


/**
 * Disconnects from MongoDB when the application is terminating or when needed.
 */
async function disconnectFromMongo() {
  if (client) {
      await client.close();
      logger.info('Disconnected from MongoDB.');
  }
}

// Exporting all the functions to be used elsewhere in the application.
module.exports = {
  connectToMongo,
  getDb,
  createDocument,
  findDocument,
  updateDocument,
  deleteDocument,
  disconnectFromMongo,
  create,
  find,
  findOne,
  update,
  deposit,
  withdraw,
  all,
};

// Note: The implementations for findDocument, updateDocument, deleteDocument, create, find, findOne, update, deposit, withdraw, and all
// are assumed to follow the pattern of createDocument, utilizing async/await, proper error handling, and logging.