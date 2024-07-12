import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const LoginForm = styled.form`
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const InputField = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  background: #fff;
`;

const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  padding: 10px;
`;

const Icon = styled.div`
  margin-right: 10px;
  color: #999;
  cursor: pointer;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: var(--primary-color);
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: var(--primary-dark);
  }
`;

const SocialButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const SocialButton = styled.button`
  flex: 1;
  margin: 0 10px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
  padding: 10px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #f0f0f0;
  }
`;

const ForgotPassword = styled.div`
  margin-top: 10px;
  color: var(--primary-color);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();
  let isMounted = true;

  useEffect(() => {
    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', formData);
      if (isMounted) {
        console.log(response.data);
        // Store the tokens and redirect to the welcome page
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        // Log tokens to verify
        console.log('Stored accessToken:', localStorage.getItem('accessToken'));
        console.log('Stored refreshToken:', localStorage.getItem('refreshToken'));
        history.push('/welcome');
      }
    } catch (error) {
      if (isMounted) {
        console.error('Login error:', error.response.data);
        setError(error.response.data.message);
      }
    } finally {
      if (isMounted) {
        setIsSubmitting(false);
      }
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `http://localhost:5001/api/auth/${provider}`;
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <InputField>
          <Icon className="fa fa-envelope" />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </InputField>
        <InputField>
          <Icon className="fa fa-lock" />
          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <Icon onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </Icon>
        </InputField>
        <Button type="submit" disabled={isSubmitting}>Login</Button>
        <ForgotPassword>Forgot Password?</ForgotPassword>
        <h3>Or login with:</h3>
        <SocialButtons>
          <SocialButton onClick={() => handleSocialLogin('google')}>Google</SocialButton>
          <SocialButton onClick={() => handleSocialLogin('apple')}>Apple</SocialButton>
        </SocialButtons>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
