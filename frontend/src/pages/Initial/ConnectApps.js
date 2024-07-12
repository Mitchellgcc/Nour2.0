import React from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import { useHistory } from 'react-router-dom';
import { FaApple, FaHeartbeat } from 'react-icons/fa';

const AppsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  position: relative;
  color: var(--white);
  background-color: var(--primary-color);
`;

const AppsMessage = styled.h1`
font-size: var(--font-size-h5);
  margin-bottom: var(--spacing-large);
  font-family: var(--font-family);
`;

const SubText = styled.p`
font-size-small-caption: 10px;
  font-weight: var(--font-light);
  margin-bottom: var(--spacing-medium);
  font-family: var(--font-family);
`;

const StyledButton = styled(Button)`
  background-color: var(--white);
  color: var(--primary-color);
  padding: 12px 24px;
  border-radius: 25px;
  font-size: var(--font-size-body1);
  font-family: var(--font-family);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: var(--light-gray);
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-large);
  gap: 20px;
  font-size: 2.5rem;
`;

const ConnectAppsScreen = () => {
  const history = useHistory();

  const handleNextScreen = () => {
    history.push('/doctor-ai-chat');
  };

  return (
    <AppsContainer>
      <IconContainer>
        <FaApple />
        <FaHeartbeat />
      </IconContainer>
      <AppsMessage>Connect to Apple Health or Other Apps</AppsMessage>
      <SubText>Link your favorite health apps for a seamless experience.</SubText>
      <StyledButton onClick={handleNextScreen}>Next</StyledButton>
    </AppsContainer>
  );
};

export default ConnectAppsScreen;
