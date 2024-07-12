// src/components/Button.js
import React from 'react';
import styled, { css } from 'styled-components';

const buttonStyles = css`
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: var(--font-size-body1);
  cursor: pointer;
  transition: background-color 0.3s ease, filter 0.3s ease;

  &:not(:last-child) {
    margin-right: 10px; /* Increase spacing between buttons */
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover {
    filter: brightness(90%);
  }

  &:active {
    filter: brightness(80%);
  }
`;

const PrimaryButton = styled.button`
  ${buttonStyles}
  background-color: var(--primary-color);
  color: var(--white);
`;

const SecondaryButton = styled.button`
  ${buttonStyles}
  background-color: var(--white);
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
`;

const IconButton = styled.button`
  ${buttonStyles}
  background-color: transparent;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FAB = styled.button`
  ${buttonStyles}
  background-color: var(--accent-color);
  color: var(--white);
  border-radius: 50%;
  padding: 16px;
  font-size: var(--font-size-body1);
  position: fixed;
  bottom: var(--spacing-medium);
  right: var(--spacing-medium);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const LoadingButton = styled.button`
  ${buttonStyles}
  background-color: var(--primary-color);
  color: var(--white);
  position: relative;

  &:after {
    content: '';
    display: ${({ loading }) => (loading ? 'inline-block' : 'none')};
    border: 2px solid var(--white);
    border-top: 2px solid var(--primary-dark);
    border-radius: 50%;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
    position: absolute;
    right: 16px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Button = ({ type, children, loading, ...props }) => {
  switch (type) {
    case 'secondary':
      return <SecondaryButton {...props}>{children}</SecondaryButton>;
    case 'icon':
      return <IconButton {...props}>{children}</IconButton>;
    case 'fab':
      return <FAB {...props}>{children}</FAB>;
    case 'loading':
      return (
        <LoadingButton {...props} loading={loading.toString()}>
          {children}
        </LoadingButton>
      );
    default:
      return <PrimaryButton {...props}>{children}</PrimaryButton>;
  }
};

export default Button;
