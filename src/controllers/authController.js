const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDataMapper = require('../dataMappers/userDataMapper');

const checkIfUserExists = async (username, email) => {
  try {
    const userExistsByUsername = await userDataMapper.getUserViaField('username', username);
    const userExistsByEmail = await userDataMapper.getUserViaField('email', email);
    return userExistsByUsername || userExistsByEmail;
  } catch (error) {
    console.error('Error during user verification:', error);
    const checkError = new Error('Error during user verification');
    checkError.status = 500;
    checkError.errCode = 2;
    checkError.errMessage = 'A server error occurred during user verification';
    throw checkError;
    // res.status(500).json({ errCode: 2, errMessage: 'An server error occurred during user verification' });
  }
};

// Login controller
const login = async (req, res) => {
  try {
    // Get the email and password from the request body
    // Call the login method of the data mapper to retrieve the user
    const { email, password } = req.body;
    const user = await userDataMapper.getUserViaField('email', email);
    // If the user is not found, return an error response
    // If the user is found, compare the password with the stored (hashed) password
    if (!user) {
      return res.status(401).json([{ errCode: 11, errMessage: 'bad login' }]);
    }
    const match = await bcrypt.compare(password, user.pwd);
    // If the password is incorrect, return an error response
    // If the password is correct, return a success response with a JWT token
    if (!match) {
      return res.status(401).json([{ errCode: 11, errMessage: 'bad login' }]);
    }
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ username: user.username, token });
  } catch (error) {
    console.error({ loginError: error });
    return res.status(500).json([{ errCode: 0, errMessage: 'A server error occurred during login' }]);
  }
};

// Register controller
const register = async (req, res) => {
  try {
    // Get the username, email and password from the request body
    // Data validation was done in the upstream middelware
    // Checks if the user already exists
    // Hash the password
    // Call the createAccount method of the data mapper to create the user
    const { username, email, password } = req.body;
    const userExist = await checkIfUserExists(username, email);
    if (userExist) {
      return res.status(400).json([{ errCode: 18, errMessage: 'Email address or username already used' }]);
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await userDataMapper.createAccount(username, email, hash);
    // Return a success response with the newly created username
    return res.status(201).json({ message: 'Successful registration ! You can log in.', username: newUser.username });
  } catch (error) {
    // If there's an error, return an error response
    console.error({ registerError: error });
    return res.status(500).json([{ errCode: 1, errMessage: 'A server error occurred during registration' }]);
  }
};

const validateToken = (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
};

// todo : implement logout feature
const logout = (req, res) => {
  res.status(200).json({ message: 'Logout feature : to be implemented' });
};

const authController = {
  login,
  register,
  validateToken,
  logout,
};

module.exports = authController;
