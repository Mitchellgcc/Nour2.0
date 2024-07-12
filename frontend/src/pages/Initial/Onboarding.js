import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import InputField from '../../components/FormElements/InputField';
import Button from '../../components/Button';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const OnboardingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  animation: ${slideIn} 0.5s ease-in-out;
`;

const OnboardingForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
`;

const StepContainer = styled.div`
  display: ${props => (props.active ? 'block' : 'none')};
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

const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    console.log('Decoded token:', decoded);
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error.message);
    return null;
  }
};

const Onboarding = () => {
  const [formData, setFormData] = useState({
    userId: '',
    healthGoals: [],
    dietaryRestrictions: [],
    allergies: [],
    macroTargets: { proteins: 0, carbohydrates: 0, fats: 0 },
    mealFrequency: 3,
    hydrationGoals: 2000,
    fitnessLevel: 'beginner',
    preferredActivities: []
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token from local storage:', accessToken);
    if (accessToken) {
      const decodedToken = decodeToken(accessToken);
      if (decodedToken) {
        setFormData(prevFormData => ({ ...prevFormData, userId: decodedToken.id }));
        console.log(`Fetched and decoded userId from token: ${decodedToken.id}`);
      } else {
        console.error('Token is missing or invalid.');
      }
    } else {
      console.error('No access token found in local storage.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'healthGoals' || name === 'preferredActivities') {
      setFormData({
        ...formData,
        [name]: Array.from(e.target.selectedOptions, option => option.value)
      });
    } else if (name === 'dietaryRestrictions' || name === 'allergies') {
      setFormData({
        ...formData,
        [name]: value.split(',').map(item => item.trim())
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    console.log(`Updated formData: ${JSON.stringify(formData)}`);
  };

  const handleNextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
      console.log(`Moved to step ${step + 1}`);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    console.log(`Moved to step ${step - 1}`);
  };

  const validateStep = () => {
    if (step === 1 && !formData.healthGoals.length) {
      setError('Please select at least one health goal');
      console.log('Validation error: Please select at least one health goal');
      return false;
    }
    setError(null);
    return true;
  };

  const validateForm = () => {
    console.log('Validating form data:', formData);
    if (!formData.userId) {
      setError('User ID is required');
      console.log('Validation error: User ID is required');
      return false;
    }
    if (!formData.healthGoals.length) {
      setError('Please select at least one health goal');
      console.log('Validation error: Please select at least one health goal');
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
    console.log('Submitting form data:', formData);

    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log('Access token used for submission:', accessToken);

      const response = await axios.post('http://localhost:5001/api/user/preferences', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Preferences saved:', response.data);
    } catch (error) {
      console.error('Error saving preferences:', error.response ? error.response.data : error.message);
      const errorMsg = error.response && error.response.data.errors
        ? error.response.data.errors.map(err => err.msg).join(', ')
        : error.message;
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
      console.log('Form submission completed');
    }
  };

  return (
    <OnboardingContainer>
      <h1>Onboarding</h1>
      <ProgressIndicator progress={(step / 3) * 100}>
        <div />
      </ProgressIndicator>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <OnboardingForm onSubmit={handleSubmit}>
        <StepContainer active={step === 1}>
          <h2>Health Goals</h2>
          <select
            name="healthGoals"
            multiple
            value={formData.healthGoals}
            onChange={handleChange}
          >
            <option value="weight loss">Weight Loss</option>
            <option value="muscle gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
            <option value="endurance">Endurance</option>
            <option value="general health">General Health</option>
          </select>
          <Button type="button" onClick={handleNextStep}>Next</Button>
        </StepContainer>
        <StepContainer active={step === 2}>
          <h2>Dietary Preferences</h2>
          <InputField
            name="dietaryRestrictions"
            placeholder="Dietary Restrictions (comma separated)"
            value={formData.dietaryRestrictions.join(', ')}
            onChange={handleChange}
          />
          <InputField
            name="allergies"
            placeholder="Allergies (comma separated)"
            value={formData.allergies.join(', ')}
            onChange={handleChange}
          />
          <Button type="button" onClick={handlePrevStep}>Back</Button>
          <Button type="button" onClick={handleNextStep}>Next</Button>
        </StepContainer>
        <StepContainer active={step === 3}>
          <h2>Fitness Level</h2>
          <select
            name="fitnessLevel"
            value={formData.fitnessLevel}
            onChange={handleChange}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <Button type="button" onClick={handlePrevStep}>Back</Button>
          <Button type="submit" disabled={isSubmitting}>Submit</Button>
        </StepContainer>
      </OnboardingForm>
    </OnboardingContainer>
  );
};

export default Onboarding;