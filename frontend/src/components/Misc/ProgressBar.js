// src/components/Misc/ProgressBar.js
import React from 'react';
import styled from 'styled-components';

const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 25px;
  overflow: hidden;
`;

const ProgressBarFiller = styled.div`
  height: 25px;
  width: ${(props) => props.percentage}%;
  background-color: ${(props) => props.color || '#76c7c0'};
  transition: width 0.5s ease-in-out;
`;

const ProgressBarLabel = styled.div`
  text-align: center;
  margin-top: 5px;
  font-weight: bold;
`;

const ProgressBar = ({ percentage, color, showLabel }) => {
  return (
    <div>
      <ProgressBarContainer>
        <ProgressBarFiller percentage={percentage} color={color} />
      </ProgressBarContainer>
      {showLabel && <ProgressBarLabel>{percentage}%</ProgressBarLabel>}
    </div>
  );
};

export default ProgressBar;
