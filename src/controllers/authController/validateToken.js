const validateToken = (req, res) => {
  res.status(200).json({ message: 'Token is valid' });
};

module.exports = validateToken;
