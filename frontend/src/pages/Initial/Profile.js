import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InputField from '../../components/FormElements/InputField';
import Button from '../../components/Button';
import axios from 'axios';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
`;

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImage: '',
    dateOfBirth: '',
    height: '',
    weight: '',
    gender: '',
    bodyComposition: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.dateOfBirth || !formData.height || !formData.weight || !formData.gender) {
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
      const response = await axios.put('http://localhost:5001/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Profile updated successfully:', response.data);
    } catch (error) {
      console.error('Profile update error:', error.response.data);
      setError(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProfileContainer>
      <h1>Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ProfileForm onSubmit={handleSubmit}>
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
        <InputField
          name="bodyComposition"
          placeholder="Body Composition (e.g., bodyFatPercentage: 20, muscleMass: 30)"
          value={formData.bodyComposition}
          onChange={handleChange}
        />
        <Button type="submit" disabled={isSubmitting}>Update Profile</Button>
      </ProfileForm>
    </ProfileContainer>
  );
};

export default Profile;
