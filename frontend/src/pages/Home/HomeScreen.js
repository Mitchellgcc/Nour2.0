import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/HomeScreen/Header';
import NourScoreWidget from '../../components/HomeScreen/NourScoreWidget';
import NextMealWidget from '../../components/HomeScreen/NextMealWidget';
import HealthStats from '../../components/HomeScreen/HealthStats';

const HomeContainer = styled.div`
  padding-top: 80px; /* Adjusted to avoid overlap with the fixed header */
`;

const HomeScreen = () => {
  const [token, setToken] = useState(null);
  const [meal, setMeal] = useState(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        console.log('Starting fetchMeal');
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
    
        if (!accessToken || !refreshToken) {
          console.error('Access token or refresh token missing');
          return;
        }
    
        const response = await fetch('http://localhost:5001/api/next-meal', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'x-refresh-token': refreshToken,
          },
        });
    
        console.log('Fetch response:', response);
    
        if (!response.ok) {
          console.error('Response not ok:', response.statusText);
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
    
        const newAccessToken = response.headers.get('x-access-token');
        const newRefreshToken = response.headers.get('x-refresh-token');
        if (newAccessToken && newRefreshToken) {
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          console.log('New tokens received and stored:', newAccessToken, newRefreshToken);
        }
    
        const mealData = await response.json();
        console.log('Meal data fetched:', mealData);
        setMeal(mealData);
      } catch (error) {
        console.error('Error fetching meal:', error);
        if (error instanceof TypeError) {
          console.error('TypeError occurred, possible network error:', error);
        } else {
          console.error('Other error:', error);
        }
      }
    };

    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) {
      setToken(storedAccessToken);
      fetchMeal();
    } else {
      console.error('No token found in local storage');
    }
  }, [token]);

  const healthStats = [
    { title: 'Caloric Intake', value: '1200/2000 kcal' },
    { title: 'Water Consumption', value: '2.5L' },
    { title: 'Activity Level', value: '8000 steps' },
    { title: 'Sleep Duration', value: '7 hours' },
    { title: 'Nutrient Balance', value: 'Protein: 30%, Carbs: 50%, Fats: 20%' }
  ];

  return (
    <HomeContainer>
      <Header />
      <NourScoreWidget />
      <NextMealWidget token={token} />
      <HealthStats stats={healthStats} />
    </HomeContainer>
  );
};

export default HomeScreen;
