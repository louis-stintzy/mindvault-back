const validator = require('validator');

export default (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  const errors = [];
  if (!username || !email || !password || !confirmPassword) {
    errors.push({ errCode: 13, errMessage: 'missing field' });
  }
  if (password !== confirmPassword) {
    errors.push({ errCode: 14, errMessage: 'passwords do not match' });
  }
  if (!validator.isEmail(email)) {
    errors.push({ errCode: 15, errMessage: 'invalid email' });
  }
  if (!validator.isStrongPassword(password)) {
    errors.push({ errCode: 16, errMessage: 'invalid password' });
  }
  if (username.length < 3 || username.length > 50) {
    errors.push({ errCode: 17, errMessage: 'invalid username' });
  }
  if (errors.length > 0) {
    res.status(400).json({ errorsArray: errors });
  } else {
    next();
  }
};

// Default options:
// {
//   minLength: 8,
//   minLowercase: 1,
//   minUppercase: 1,
//   minNumbers: 1,
//   minSymbols: 1,
//   returnScore: false,
//   pointsPerUnique: 1,
//   pointsPerRepeat: 0.5,
//   pointsForContainingLower: 10,
//   pointsForContainingUpper: 10,
//   pointsForContainingNumber: 10,
//   pointsForContainingSymbol: 10
// }
