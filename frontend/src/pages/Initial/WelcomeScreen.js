import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Button from '../../components/Button';

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  position: relative;
  color: white;
  background-color: #000;
`;

const WelcomeMessage = styled.h1`
  font-size: var(--font-size-h1);
  margin-bottom: var(--spacing-large);
  font-family: var(--font-family);
`;

const SubText = styled.p`
  font-size: var(--font-size-h4);
  font-weight: var(--font-light);
  margin-bottom: var(--spacing-medium);
  font-family: var(--font-family);
`;

const WelcomeScreen = () => {
  const history = useHistory();

  const handleGetStarted = () => {
    history.push('/connect-wearable');
  };

  return (
    <WelcomeContainer>
      <WelcomeMessage>Hello</WelcomeMessage>
      
      <Button onClick={handleGetStarted}>Swipe up to start</Button>
    </WelcomeContainer>
  );
};

export default WelcomeScreen;
