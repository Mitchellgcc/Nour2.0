import React from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';
import { useHistory } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';

const WearableContainer = styled.div`
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

const WearableMessage = styled.h1`
  font-size: var(--font-size-h5);
  margin-bottom: var(--spacing-large);
  font-family: var(--font-family);
`;

const SubText = styled.p`
  font-size: var(--font-size-body1);
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
  font-size: 2.5rem;
  margin-bottom: var(--spacing-large);
`;

const ConnectWearableScreen = () => {
  const history = useHistory();

  const handleNextScreen = () => {
    console.log('Next button clicked. Redirecting to /connect-apps');
    history.push('/connect-apps');
  };

  const handleConnectWhoop = () => {
    console.log('Connect Whoop button clicked. Redirecting to Whoop OAuth flow');
    window.location.href = 'http://localhost:5001/api/whoop/auth/whoop';
  };

  return (
    <WearableContainer>
      <IconContainer>
        <FaHeartbeat />
      </IconContainer>
      <WearableMessage>Connect Your Wearable Device</WearableMessage>
      <SubText>Sync your data to personalize your experience.</SubText>
      <StyledButton onClick={handleConnectWhoop}>Connect Whoop</StyledButton>
      <StyledButton onClick={handleNextScreen}>Next</StyledButton>
    </WearableContainer>
  );
};

export default ConnectWearableScreen;
