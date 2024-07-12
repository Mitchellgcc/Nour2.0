import React from 'react';
import styled from 'styled-components';

const VerticalNavContainer = styled.div`
  width: 250px;
  background-color: var(--light-gray);
  padding: var(--spacing-medium);
`;

const NavItem = styled.div`
  padding: var(--spacing-small);
  color: var(--black);
  cursor: pointer;

  &:hover {
    background-color: var(--gray);
  }
`;

const VerticalNavMenu = ({ items }) => {
  return (
    <VerticalNavContainer>
      {items.map((item, index) => (
        <NavItem key={index}>{item}</NavItem>
      ))}
    </VerticalNavContainer>
  );
};

export default VerticalNavMenu;
