/**
 * userRepository.js
 * ./backend/repositories/userRepository.js
 * 
 * The UserRepository class provides a collection of methods to interact with the User model.
 * These methods facilitate creating, finding, updating, and deleting user records in the database,
 * as well as managing user balances and transaction histories.
 */

const User = require('../models/user');

class UserRepository {
    /**
     * Creates a new user and saves it to the database.
     * @param {Object} userData - The user data to create a new user.
     * @returns {Object} The saved user object.
     * @throws {Error} If saving the user fails.
     */
    async createUser(userData) {
        try {
            const user = new User(userData);
            await user.save();
            return user;
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    /**
     * Finds a user by their email.
     * @param {String} email - The email of the user to find.
     * @returns {Object|null} The found user object or null if not found.
     * @throws {Error} If there is a problem querying the database.
     */
    async findUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error(`Error finding user by email: ${error.message}`);
        }
    }

    /**
     * Retrieves all users from the database.
     * @returns {Array} An array of user objects.
     * @throws {Error} If there is a problem querying the database.
     */
    async all() {
        try {
            return await User.find();
        } catch (error) {
            throw new Error(`Error retrieving all users: ${error.message}`);
        }
    }

    /**
     * Deposits an amount to the user's balance.
     * @param {String} email - The email of the user to deposit money to.
     * @param {Number} amount - The amount to deposit.
     * @returns {Object|null} The updated balance or null if user not found.
     * @throws {Error} If there is a problem updating the user.
     */
    async deposit(email, amount) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return null;
            }
            user.balance += amount;
            await user.save();
            return { balance: user.balance };
        } catch (error) {
            throw new Error(`Error depositing money: ${error.message}`);
        }
    }

    /**
     * Withdraws an amount from the user's balance.
     * @param {String} email - The email of the user to withdraw money from.
     * @param {Number} amount - The amount to withdraw.
     * @returns {Object|null} The updated balance or null if user not found or insufficient funds.
     * @throws {Error} If there is a problem updating the user.
     */
    async withdraw(email, amount) {
        try {
            const user = await User.findOne({ email });
            if (!user || user.balance < amount) {
                return null;
            }
            user.balance -= amount;
            await user.save();
            return { balance: user.balance };
        } catch (error) {
            throw new Error(`Error withdrawing money: ${error.message}`);
        }
    }

    /**
     * Updates user data.
     * @param {String} email - The email of the user to update.
     * @param {Object} newData - The new data for the user.
     * @returns {Object|null} The updated user object or null if user not found.
     * @throws {Error} If there is a problem updating the user.
     */
    async updateUser(email, newData) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return null;
            }
            Object.assign(user, newData);
            await user.save();
            return user;
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    /**
     * Deletes a user by their email.
     * @param {String} email - The email of the user to delete.
     * @returns {Object|null} The deleted user object or null if user not found.
     * @throws {Error} If there is a problem deleting the user.
     */
    async deleteUser(email) {
        try {
            return await User.findOneAndDelete({ email });
        } catch (error) {
            throw new Error(`Error deleting user: ${error.message}`);
        }
    }

    /**
     * Retrieves the transaction history for a user.
     * @param {String} email - The email of the user whose transaction history is to be retrieved.
     * @returns {Array|null} The transaction history array or null if user not found.
     * @throws {Error} If there is a problem querying the database.
     */
    async getTransactionHistory(email) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return null;
            }
            return user.transactionHistory;
        } catch (error) {
            throw new Error(`Error getting transaction history: ${error.message}`);
        }
    }
}

// Export the UserRepository class for use in other parts of the application.
module.exports = UserRepository;