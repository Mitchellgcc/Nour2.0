import React from 'react';
import styled from 'styled-components';
import { FaHome, FaUtensils, FaHeartbeat, FaUsers } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

const FooterContainer = styled.footer`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: var(--spacing-medium);
  background-color: var(--primary-color);
  color: var(--white);
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1000;
  font-family: var(--font-family);
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: var(--white);

  &:hover {
    color: var(--accent-light-gray);
  }
`;

const Icon = styled.div`
  font-size: 1.5rem;
  margin-bottom: var(--spacing-small);
`;

const Label = styled.div`
  font-size: var(--font-size-caption);
  font-family: var(--font-family);
`;

const Footer = () => {
  const history = useHistory();

  const navigateTo = (path) => {
    history.push(path);
  };

  return (
    <FooterContainer>
      <NavItem onClick={() => navigateTo('/home')}>
        <Icon><FaHome /></Icon>
        <Label>Home</Label>
      </NavItem>
      <NavItem onClick={() => navigateTo('/meal-planning')}>
        <Icon><FaUtensils /></Icon>
        <Label>Meal Planning</Label>
      </NavItem>
      <NavItem onClick={() => navigateTo('/health-metrics')}>
        <Icon><FaHeartbeat /></Icon>
        <Label>Health Metrics</Label>
      </NavItem>
      <NavItem onClick={() => navigateTo('/community')}>
        <Icon><FaUsers /></Icon>
        <Label>Community</Label>
      </NavItem>
    </FooterContainer>
  );
};

export default Footer;
