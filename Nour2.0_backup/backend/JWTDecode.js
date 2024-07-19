import jwtDecode from 'jwt-decode';

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return null;
  }
};

const validateToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) {
    return false;
  }
  if (decoded.exp * 1000 < Date.now()) {
    console.error('Token has expired');
    return false;
  }
  return decoded;
};

// Fetch tokens from localStorage
const accessToken = localStorage.getItem('accessToken');
const authToken = localStorage.getItem('authToken');
const refreshToken = localStorage.getItem('refreshToken');
const token = localStorage.getItem('token');

// Validate tokens
const isAccessTokenValid = validateToken(accessToken);
const isAuthTokenValid = validateToken(authToken);
const isRefreshTokenValid = validateToken(refreshToken);
const isTokenValid = validateToken(token);

// Log validation results
console.log('Access Token Valid:', isAccessTokenValid);
console.log('Auth Token Valid:', isAuthTokenValid);
console.log('Refresh Token Valid:', isRefreshTokenValid);
console.log('Token Valid:', isTokenValid);

// Use the valid token to set userId
if (isAccessTokenValid) {
  const userId = isAccessTokenValid.id;
  console.log('User ID from Access Token:', userId);
}
