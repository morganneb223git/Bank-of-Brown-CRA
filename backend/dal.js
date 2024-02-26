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
 * @param {string} accountNumber User's account number.
 * @returns {Object} The created user object.
 */
async function createUser({ name, email, password, accountNumber }) {
    try {
        const { db } = await connectToMongo();
        const collection = db.collection('users');

        const doc = {
            name,
            email,
            password,
            balance: 0,
            accountNumber,
            accountType: 'checking',
            role: 'user'
        };

        const result = await collection.insertOne(doc);

        return result.ops[0];
    } catch (err) {
        logger.error(`Error creating user: ${err.message}`, { stack: err.stack });
        throw err;
    }
}

/**
 * Finds users by email.
 * @param {string} email Email to search for.
 * @returns {Array<Object>} An array of user objects with the matching email.
 */
async function findUsersByEmail(email) {
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
 * @returns {Object|null} A user object with the matching email or null if not found.
 */
async function findUserByEmail(email) {
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
 * @returns {Object} The updated user object.
 */
async function updateUserByEmail(email, newData) {
    try {
        const { db } = await connectToMongo();
        const result = await db.collection('users').findOneAndUpdate(
            { email },
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
 * Sets up the data access layer.
 * @returns {Promise<Object>} The database instance and a function to stop the database.
 */
async function setupDAL() {
    return await connectToMongo();
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

async function createBankAccount(email, accountType) {
  try {
      const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
      const newData = { accountNumber, accountType };
      return await update(email, newData);
  } catch (error) {
      logger.error(`Error creating bank account: ${error.message}`, { stack: error.stack });
      throw error;
  }
}

/**
 * Updates user information in the database.
 * @param {string} email - Email of the user to update.
 * @param {Object} newData - New data for the user.
 * @returns {Promise<Object|null>} - The updated user object, or null if user not found.
 */
async function update(email, newData) {
  try {
      const { db } = await connectToMongo();
      const result = await db.collection('users').updateOne(
          { email }, // Filter to find the user by email
          { $set: newData } // Set the new data
      );

      if (result.modifiedCount === 1) {
          // If one document was modified, return the updated user
          const updatedUser = await db.collection('users').findOne({ email });
          return updatedUser;
      } else {
          // If no document was modified, return null to indicate no update occurred
          return null;
      }
  } catch (error) {
      logger.error(`Error updating user: ${error.message}`, { stack: error.stack });
      throw error;
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
    createUser,
    findUsersByEmail,
    findUserByEmail,
    updateUserByEmail,
    setupDAL,
    createBankAccount,
    update
};
