const client = require('../database');

async function getUserViaField(field, value) {
  try {
    const query = `SELECT * FROM "user" WHERE ${field} =$1`;
    const result = await client.query(query, [value]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (error) {
    console.error('Error during user verification :', error);
    return null;
  }
}

async function createAccount(username, email, hash) {
  try {
    const query = 'INSERT INTO "user" (username, email, pwd) VALUES ($1, $2,$3) RETURNING username';
    const values = [username, email, hash];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating account:', error);
    return null;
  }
}

module.exports = {
  getUserViaField,
  createAccount,
};
