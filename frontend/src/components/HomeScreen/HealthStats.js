import React from 'react';
import styled from 'styled-components';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin: 20px;
`;

const StatBox = styled.div`
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const StatValue = styled.p`
  font-size: 1rem;
`;

const HealthStats = ({ stats }) => {
  return (
    <StatsContainer>
      {stats.map((stat, index) => (
        <StatBox key={index}>
          <StatTitle>{stat.title}</StatTitle>
          <StatValue>{stat.value}</StatValue>
        </StatBox>
      ))}
    </StatsContainer>
  );
};

export default HealthStats;
