// src/components/Notifications/InlineNotification.js
import React from 'react';
import styled from 'styled-components';

const InlineContainer = styled.div`
  background: var(--dark-gray);
  color: white;
  padding: 16px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
`;

const InlineNotification = ({ message, onClose }) => (
  <InlineContainer>
    {message}
    <CloseButton onClick={onClose}>&times;</CloseButton>
  </InlineContainer>
);

export default InlineNotification;
