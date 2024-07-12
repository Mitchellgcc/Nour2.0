// src/components/Notifications/ToastNotification.js
import React, { useEffect } from 'react';
import styled from 'styled-components';

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--dark-gray);
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, opacity 0.3s ease;
  transform: ${({ show }) => (show ? 'translateY(0)' : 'translateY(-100%)')};
  opacity: ${({ show }) => (show ? 1 : 0)};
`;

const CloseButton = styled.button`
  margin-left: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
`;

const ToastNotification = ({ message, onClose, show, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <ToastContainer show={show}>
      {message}
      <CloseButton onClick={onClose}>&times;</CloseButton>
    </ToastContainer>
  );
};

export default ToastNotification;
