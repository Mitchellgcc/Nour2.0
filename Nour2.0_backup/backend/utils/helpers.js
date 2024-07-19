const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
  const userId = user.id.toString(); // Ensure userId is a string
  console.log('Generating tokens for userId:', userId);
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  console.log('Generated access token:', accessToken);
  console.log('Generated refresh token:', refreshToken);

  return { accessToken, refreshToken };
};

module.exports = { generateTokens };
