// src/pages/Confirmation.js
import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useHistory } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ConfirmationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  animation: ${fadeIn} 2s ease-in-out;
`;

const ConfirmationMessage = styled.h1`
  font-size: 2.5rem;
  margin-bottom: var(--spacing-large);
`;

const Confirmation = () => {
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      history.push('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [history]);

  return (
    <ConfirmationContainer>
      <ConfirmationMessage>Registration Successful!</ConfirmationMessage>
      <p>Redirecting to login...</p>
    </ConfirmationContainer>
  );
};

export default Confirmation;
