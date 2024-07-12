// Nour2.0/frontend/src/pages/Initial/Register.js

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import InputField from '../../components/FormElements/InputField';
import Button from '../../components/Button';
import axios from 'axios';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  animation: ${slideIn} 0.5s ease-in-out;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
`;

const StepContainer = styled.div`
  display: ${props => (props.active ? 'block' : 'none')};
`;

const Tooltip = styled.span`
  position: relative;
  display: inline-block;
  cursor: pointer;

  &::after {
    content: '${props => props.text}';
    position: absolute;
    width: 120px;
    bottom: 100%;
    left: 50%;
    margin-left: -60px;
    padding: 5px;
    border-radius: 4px;
    background-color: #555;
    color: #fff;
    text-align: center;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::after {
    visibility: visible;
    opacity: 1;
  }
`;

const ProgressIndicator = styled.div`
  width: 100%;
  background-color: #f3f3f3;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 20px;

  div {
    height: 10px;
    width: ${props => props.progress}%;
    background-color: var(--primary-color);
    transition: width 0.3s;
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    height: '',
    weight: '',
    gender: ''
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.dateOfBirth || !formData.height || !formData.weight || !formData.gender) {
      setError('All fields are required');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', formData);
      console.log('Registration successful:', response.data);
      // Store tokens in local storage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      // Log tokens to verify
      console.log('Stored accessToken:', localStorage.getItem('accessToken'));
      console.log('Stored refreshToken:', localStorage.getItem('refreshToken'));
    } catch (error) {
      console.error('Registration error:', error.response.data);
      setError(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegisterContainer>
      <h1>Register</h1>
      <ProgressIndicator progress={(step / 2) * 100}>
        <div />
      </ProgressIndicator>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      <RegisterForm onSubmit={handleSubmit}>
        <StepContainer active={step === 1}>
          <InputField
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />
          <InputField
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />
          <InputField
            name="email"
            placeholder="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            name="dateOfBirth"
            placeholder="Date of Birth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <Button type="button" onClick={handleNextStep}>Next</Button>
        </StepContainer>
        <StepContainer active={step === 2}>
          <InputField
            name="password"
            placeholder="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Tooltip text="Use 8 or more characters with a mix of letters, numbers & symbols">
            <i className="fa fa-info-circle"></i>
          </Tooltip>
          <InputField
            name="height"
            placeholder="Height (in cm)"
            type="number"
            value={formData.height}
            onChange={handleChange}
          />
          <InputField
            name="weight"
            placeholder="Weight (in kg)"
            type="number"
            value={formData.weight}
            onChange={handleChange}
          />
          <InputField
            name="gender"
            placeholder="Gender"
            type="text"
            value={formData.gender}
            onChange={handleChange}
          />
          <Button type="button" onClick={handlePrevStep}>Back</Button>
          <Button type="submit" disabled={isSubmitting}>Register</Button>
        </StepContainer>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;
