import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log('Adding token to request headers:', token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request config:', config);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    // Update tokens if new ones are received in the response headers
    const newAccessToken = response.headers['x-access-token'];
    const newRefreshToken = response.headers['x-refresh-token'];
    if (newAccessToken) {
      console.log('New access token received:', newAccessToken);
      localStorage.setItem('accessToken', newAccessToken);
    }
    if (newRefreshToken) {
      console.log('New refresh token received:', newRefreshToken);
      localStorage.setItem('refreshToken', newRefreshToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('Attempting to refresh token with:', refreshToken);
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/refresh-token`, { refreshToken });
        const { accessToken } = response.data;
        console.log('Token refreshed successfully:', accessToken);
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Optionally, handle logout or redirect to login page
        return Promise.reject(refreshError);
      }
    }
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

export default api;
