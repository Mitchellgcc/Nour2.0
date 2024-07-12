// frontend/src/components/Header.js

import React from 'react';
import styled from 'styled-components';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-medium);
  background-color: var(--primary-color);
  color: var(--white);
  font-family: var(--font-family);
`;

const Logo = styled.div`
  font-size: var(--font-size-h4);
  font-weight: var(--font-bold);
  font-family: var(--font-family);
`;

const SearchBar = styled.input`
  padding: var(--spacing-small);
  border-radius: 4px;
  border: none;
  font-size: var(--font-size-body1);
  margin-right: var(--spacing-medium);
  font-family: var(--font-family);

  &::placeholder {
    color: var(--gray);
  }
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;

  & > * {
    margin-left: var(--spacing-small);
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>AppLogo</Logo>
      <SearchBar type="text" placeholder="Search..." />
      <IconsContainer>
        <FaBell size={24} />
        <FaUserCircle size={24} />
      </IconsContainer>
    </HeaderContainer>
  );
};

export default Header;
