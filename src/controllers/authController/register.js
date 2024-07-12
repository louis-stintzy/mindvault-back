const bcrypt = require('bcrypt');

const userDataMapper = require('../../dataMappers/userDataMapper');

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

module.exports = register;
