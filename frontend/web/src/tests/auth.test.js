// src/tests/auth.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Login from '../components/Auth/Login';

test('renders login form', () => {
  render(
    <Provider store={store}>
      <Login />
    </Provider>
  );

  const loginElements = screen.getAllByText(/login/i);
  expect(loginElements).toHaveLength(2);

  const headerElement = screen.getByRole('heading', { name: /login/i });
  expect(headerElement).toBeInTheDocument();

  const buttonElement = screen.getByRole('button', { name: /login/i });
  expect(buttonElement).toBeInTheDocument();
});
