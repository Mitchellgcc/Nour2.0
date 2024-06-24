// Nour2.0/frontend/web/src/components/Auth/Login.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form Submitted:', { email, password });  // Log form submission
    try {
      console.log('Sending POST request to /api/auth/login');
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);  // Log the response for debugging
      localStorage.setItem('token', response.data.token);
      console.log('Token saved to localStorage:', response.data.token);  // Log the token for debugging
      history.push('/profile');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
