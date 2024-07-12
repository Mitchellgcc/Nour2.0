import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

const MealWidgetContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MealImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
`;

const MealDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 70%;
  padding: 10px;
`;

const MealName = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const NutritionalInfo = styled.p`
  margin: 5px 0;
`;

const ViewButton = styled.button`
  align-self: flex-end;
  padding: 10px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #555;
  }
`;

const NextMealWidget = () => {
  const [meal, setMeal] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        console.log('Starting fetchMeal');
        const response = await api.get('/next-meal');
        console.log('Meal data fetched:', response.data);
        setMeal(response.data);
      } catch (error) {
        console.error('Error fetching meal data:', error);
        setError('Error fetching meal data');
      }
    };

    fetchMeal();
  }, []);

  const handleViewFullMeal = () => {
    if (meal && meal._id) {
      console.log('Navigating to meal detail page with ID:', meal._id);
      history.push(`/meal/${meal._id}`);
    } else {
      console.error('Meal ID is missing');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!meal) {
    return <div>Loading...</div>;
  }

  return (
    <MealWidgetContainer>
      <MealImage 
        src={meal.imageURL || 'https://via.placeholder.com/150'} 
        alt={meal.name || 'Meal Image'} 
      />
      <MealDetails>
        <MealName>{meal.name}</MealName>
        <NutritionalInfo>Calories: {meal.calories}</NutritionalInfo>
        <NutritionalInfo>Proteins: {meal.protein}g</NutritionalInfo>
        <NutritionalInfo>Fats: {meal.fat}g</NutritionalInfo>
        <NutritionalInfo>Carbs: {meal.carbs}g</NutritionalInfo>
        <ViewButton onClick={handleViewFullMeal}>View Full Meal</ViewButton>
      </MealDetails>
    </MealWidgetContainer>
  );
};

export default NextMealWidget;
