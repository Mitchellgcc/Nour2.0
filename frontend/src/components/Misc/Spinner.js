// src/components/Misc/Spinner.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: inline-block;
  width: ${(props) => props.size || '40px'};
  height: ${(props) => props.size || '40px'};
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${(props) => props.color || '#000'};
  animation: ${spin} 1s linear infinite;
`;

const Spinner = ({ size, color }) => {
  return <SpinnerContainer size={size} color={color} />;
};

export default Spinner;
