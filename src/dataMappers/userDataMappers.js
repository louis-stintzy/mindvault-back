const client = require('../database');

async function getUserViaHisEmail(email) {

    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const values = [email];
        const result = await client.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error logging in:', error);
        return null;
    }
}

// Function to create a new account
async function createAccount(username, password) {
    try {
        const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
        const values = [username, password];
        await client.query(query, values);
        return true;
    } catch (error) {
        console.error('Error creating account:', error);
        return false;
    }
}

// Function to authenticate a user
async function authenticateUser(username, password) {
    try {
        const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
        const values = [username, password];
        const result = await client.query(query, values);
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error authenticating user:', error);
        return false;
    }
}

module.exports = {
    getUserViaHisEmail,
    createAccount,

};
