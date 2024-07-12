import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import Button from '../../components/Button';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const PreferencesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  animation: ${slideIn} 0.5s ease-in-out;
  padding: 20px;
`;

const PreferencesForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  gap: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
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

const refreshToken = async () => {
  try {
    console.log('Attempting to refresh token...');
    const response = await axios.post('http://localhost:5001/api/auth/refresh', {
      token: localStorage.getItem('refreshToken')
    });
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    console.log('Token refreshed successfully:', { accessToken, refreshToken });
    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    return null;
  }
};

const Preferences = () => {
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
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initializePreferences = async () => {
      const token = localStorage.getItem('token');
      console.log('Fetched token from localStorage:', token);

      if (token) {
        const decodedToken = decodeToken(token);
        const currentTime = Math.floor(Date.now() / 1000);
        console.log('Current time:', currentTime, 'Token expiry time:', decodedToken.exp);

        if (decodedToken.exp < currentTime) {
          console.log('Token has expired. Attempting to refresh token...');
          const newToken = await refreshToken();
          if (newToken) {
            console.log('Token refreshed successfully');
            const refreshedDecodedToken = decodeToken(newToken);
            setFormData(prevFormData => ({ ...prevFormData, userId: refreshedDecodedToken.id }));
            console.log(`Fetched and decoded userId from token: ${refreshedDecodedToken.id}`);
            fetchPreferences(refreshedDecodedToken.id, newToken);
          } else {
            setError('Session expired. Please log in again.');
          }
        } else {
          setFormData(prevFormData => ({ ...prevFormData, userId: decodedToken.id }));
          console.log(`Fetched and decoded userId from token: ${decodedToken.id}`);
          fetchPreferences(decodedToken.id, token);
        }
      } else {
        console.error('No token found in local storage.');
        setError('No token found in local storage.');
      }
    };

    const fetchPreferences = async (userId, token) => {
      try {
        console.log('Fetching user preferences...');
        const response = await axios.get(`http://localhost:5001/api/user/preferences/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && typeof response.data === 'object') {
          console.log('User preferences fetched:', response.data);
          setFormData(response.data);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        console.log('Error response:', error.response);
        if (error.response && error.response.status === 401) {
          console.error('Error fetching preferences: Authentication failed. Please log in again.');
          setError('Authentication failed. Please log in again.');
        } else {
          console.error('Error fetching preferences:', error.response ? error.response.data : error.message);
          setError(error.response ? error.response.data.message : error.message);
        }
      }
    };

    initializePreferences();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, options } = e.target;
    let updatedValue;

    if (type === 'select-multiple') {
      updatedValue = Array.from(options).filter(option => option.selected).map(option => option.value);
    } else if (type === 'checkbox') {
      updatedValue = checked;
    } else if (name === 'dietaryRestrictions' || name === 'allergies') {
      updatedValue = value.split(',').map(item => item.trim());
    } else {
      updatedValue = value;
    }

    setFormData({
      ...formData,
      [name]: updatedValue
    });

    console.log(`Updated ${name} to ${updatedValue}`);
  };

  const validateForm = () => {
    if (!formData.userId) {
      setError('User ID is required');
      return false;
    }
    if (!formData.healthGoals.length) {
      setError('Please select at least one health goal');
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

    const token = localStorage.getItem('token');
    console.log('Submitting form with token:', token);

    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        try {
          console.log('Saving user preferences...');
          const response = await axios.put(`http://localhost:5001/api/user/preferences/${decodedToken.id}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Preferences saved:', response.data);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            console.error('Error saving preferences: Authentication failed. Please log in again.');
            setError('Authentication failed. Please log in again.');
          } else {
            console.error('Error saving preferences:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.message : error.message);
          }
        } finally {
          setIsSubmitting(false);
        }
      } else {
        console.error('Token is missing or invalid.');
        setError('Session expired. Please log in again.');
        setIsSubmitting(false);
      }
    } else {
      console.error('No token found in local storage.');
      setError('No token found in local storage.');
      setIsSubmitting(false);
    }
  };

  return (
    <PreferencesContainer>
      <h1>Preferences</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <PreferencesForm onSubmit={handleSubmit}>
        <h2>Health Goals</h2>
        <Select
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
        </Select>
        <h2>Dietary Preferences</h2>
        <Input
          name="dietaryRestrictions"
          placeholder="Dietary Restrictions"
          value={Array.isArray(formData.dietaryRestrictions) ? formData.dietaryRestrictions.join(', ') : formData.dietaryRestrictions}
          onChange={handleChange}
        />
        <Input
          name="allergies"
          placeholder="Allergies"
          value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : formData.allergies}
          onChange={handleChange}
        />
        <h2>Fitness Level</h2>
        <Select
          name="fitnessLevel"
          value={formData.fitnessLevel}
          onChange={handleChange}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </Select>
        <Button type="submit" disabled={isSubmitting}>Save</Button>
      </PreferencesForm>
    </PreferencesContainer>
  );
};

export default Preferences;