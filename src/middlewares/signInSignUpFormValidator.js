const validator = require('validator');

const checkEmail = (email) => {
  if (!email) {
    return { errCode: 13, errMessage: 'missing field' };
  }
  if (!validator.isEmail(email)) {
    return { errCode: 15, errMessage: 'invalid email' };
  }
  return null;
};

const checkPassword1 = (password) => {
  if (!password) {
    return { errCode: 13, errMessage: 'missing field' };
  }
};

const checkPassword2 = (password, confirmPassword) => {
  if (!password || !confirmPassword) {
    return { errCode: 13, errMessage: 'missing field' };
  }
  if (password !== confirmPassword) {
    return { errCode: 14, errMessage: 'passwords do not match' };
  }
  if (!validator.isStrongPassword(password)) {
    return { errCode: 16, errMessage: 'invalid password' };
  }
  return null;
};

const checkUsername = (username) => {
  if (!username) {
    return { errCode: 13, errMessage: 'missing field' };
  }
  if (username.length < 3 || username.length > 50) {
    return { errCode: 17, errMessage: 'invalid username' };
  }
  return null;
};

const checkLoginForm = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];
  const passwordError = checkPassword1(password);
  const emailError = checkEmail(email);
  if (passwordError) errors.push(passwordError);
  if (emailError) errors.push(emailError);
  if (errors.length > 0) {
    res.status(400).json({ errorsArray: errors });
  } else {
    next();
  }
};

const checkRegistrationForm = (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  const errors = [];
  const usernameError = checkUsername(username);
  const emailError = checkEmail(email);
  const passwordError = checkPassword2(password, confirmPassword);
  if (usernameError) errors.push(usernameError);
  if (emailError) errors.push(emailError);
  if (passwordError) errors.push(passwordError);
  if (errors.length > 0) {
    res.status(400).json({ errorsArray: errors });
  } else {
    next();
  }
};

module.exports = {
  checkLoginForm,
  checkRegistrationForm,
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
