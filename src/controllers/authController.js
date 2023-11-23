const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDataMapper = require('../dataMappers/userDataMapper');


// Import the data mapper (replace DataMapper with the actual name of your data mapper)
// const DataMapper = require('../dataMapper');

// Login controller
const login = async (req, res) => {
  try {
    // Get the email and password from the request body and
    // Call the login method of the data mapper to retrieve the user
    const { email, pwd } = req.body;
    const user = await userDataMapper.getUserViaField('email', email);
    // If the user is not found, return an error response
    // If the user is found, compare the password with the stored (hashed) password
    if (!user) {
      res.status(401).json({ errCode: 11, errMessage: 'bad login' });
    }
    const match = await bcrypt.compare(pwd, user.pwd);
    // If the password is incorrect, return an error response
    // If the password is correct, return a success response with a JWT token
    if (!match) {
      res.status(401).json({ errCode: 11, errMessage: 'bad login' });
    }
    const token = jwt.sign({ username: user.username }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
    res.status(200).json({ username: user.username, token });
  } catch (error) {
    console.log({ loginError: error });
    res.status(500).json({ errCode: 0, errMessage: 'An server error occurred during login' });
  }
};

// Register controller
const register = async (req, res) => {
  try {
    // Get the username, email and password from the request body
    // Data validation was done in the upstream middelware
    // Hash the password
    // Call the createAccount method of the data mapper to create the user
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await userDataMapper.createAccount(username, email, hash);
    // Return a success response with the newly created username
    res.status(201).json({ message: 'Registration successful', username: newUser.username });
  } catch (error) {
    // If there's an error, return an error response
    res.status(500).json({ errCode: 1, errMessage: 'An server error occurred during registration' });
  }
};

const authController = {
  login,
  register,
};

module.exports = authController;
