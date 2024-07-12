import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

const Container = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MealImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
`;

const MealDetails = styled.div`
  margin-top: 20px;
`;

const Section = styled.div`
  margin-top: 20px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const NutritionalInfo = styled.p`
  margin: 5px 0;
`;

const Button = styled.button`
  margin-top: 20px;
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

const NextMealDetail = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMeal = async () => {
      try {
        console.log(`Starting fetchMeal with ID: ${id}`);
        const response = await api.get(`/api/next-meal/${id}`);
        console.log('Meal data fetched:', response.data);

        if (isMounted) {
          if (response.headers['content-type'].includes('application/json')) {
            setMeal(response.data);
          } else {
            setError('Unexpected response format');
            console.error('Expected JSON but received:', response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching meal details:', error);
        if (isMounted) {
          setError('Error fetching meal details');
        }
      }
    };

    fetchMeal();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!meal) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <MealImage src={meal.imageURL || 'https://via.placeholder.com/600'} alt={meal.name} />
      <MealDetails>
        <Title>{meal.name}</Title>
        <p>{meal.description}</p>
        <NutritionalInfo>Calories: {meal.calories}</NutritionalInfo>
        <NutritionalInfo>Proteins: {meal.protein}g</NutritionalInfo>
        <NutritionalInfo>Fats: {meal.fat}g</NutritionalInfo>
        <NutritionalInfo>Carbs: {meal.carbs}g</NutritionalInfo>
      </MealDetails>
      <Section>
        <Title>Ingredients</Title>
        <ul>
          {meal.ingredients && meal.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </Section>
      <Section>
        <Title>Cooking Instructions</Title>
        <ol>
          {meal.instructions && meal.instructions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </Section>
      <Section>
        <Title>This Meal & Me</Title>
        <p>{meal.personalizedExplanation || 'No personalized explanation available'}</p>
      </Section>
      <Button onClick={() => handleFavorite(meal._id)}>Favorite</Button>
      <Button onClick={() => handleFeedback(meal._id)}>Give Feedback</Button>
    </Container>
  );
};

const handleFavorite = async (mealId) => {
  try {
    await api.post('/api/next-meal/favorite-meal', { mealId });
    alert('Meal favorited successfully');
  } catch (error) {
    alert('Error favoriting meal');
  }
};

const handleFeedback = async (mealId) => {
  const feedback = prompt('Please provide your feedback:');
  if (feedback) {
    try {
      await api.post('/api/next-meal/submit-feedback', { mealId, feedback });
      alert('Feedback submitted successfully');
    } catch (error) {
      alert('Error submitting feedback');
    }
  }
};

export default NextMealDetail;
