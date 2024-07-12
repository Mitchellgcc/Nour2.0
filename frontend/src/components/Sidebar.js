import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: var(--light-gray);
  padding: var(--spacing-medium);
  height: 100vh;
`;

const SidebarItem = styled.div`
  padding: var(--spacing-small);
  color: var(--black);
  cursor: pointer;

  &:hover {
    background-color: var(--gray);
  }
`;

const Sidebar = ({ items }) => {
  return (
    <SidebarContainer>
      {items.map((item, index) => (
        <SidebarItem key={index}>{item}</SidebarItem>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;
