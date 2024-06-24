// src/tests/Button.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/UI/Button';  // Ensure this path is correct

test('renders Button component', () => {
  render(<Button>Click Me</Button>);
  const buttonElement = screen.getByText(/click me/i);
  expect(buttonElement).toBeInTheDocument();
});

test('calls onClick handler', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);
  const buttonElement = screen.getByText(/click me/i);
  fireEvent.click(buttonElement);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
