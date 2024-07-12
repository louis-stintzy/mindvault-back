const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userDataMapper = require('../../dataMappers/userDataMapper');

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

module.exports = login;
