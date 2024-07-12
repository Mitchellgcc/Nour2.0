// src/components/Notifications/AlertBanner.js
import React, { useEffect } from 'react';
import styled from 'styled-components';

const BannerContainer = styled.div`
  background: var(--dark-gray);
  color: white;
  padding: 10px 20px;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
`;

const AlertBanner = ({ message, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <BannerContainer>
      {message}
      <CloseButton onClick={onClose}>&times;</CloseButton>
    </BannerContainer>
  );
};

export default AlertBanner;
