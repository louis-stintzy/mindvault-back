// const client = require('../database');
const { pool } = require('./database');

async function getUserViaField(field, value) {
  try {
    if (field !== 'username' && field !== 'email') {
      throw new Error('Invalid field');
    }
    const query = `SELECT * FROM "user" WHERE ${field} =$1`;
    const result = await pool.query(query, [value]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (error) {
    console.error('Error during user verification :', error);
    throw error;
  }
}

async function createAccount(username, email, hash) {
  try {
    const query = 'INSERT INTO "user" (username, email, pwd) VALUES ($1, $2,$3) RETURNING username';
    const values = [username, email, hash];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating account:', error);
    throw error;
  }
}

module.exports = {
  getUserViaField,
  createAccount,
};
