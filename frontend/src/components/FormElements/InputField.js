// src/components/FormElements/InputField.js
import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  border: 1px solid var(--light-gray);
  padding: 12px;
  border-radius: 4px;
  font-size: var(--font-size-body1);
  width: 100%;
  box-sizing: border-box;
  margin-bottom: var(--spacing-medium);

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
  
  &:hover {
    border-color: var(--primary-light);
  }
`;

const InputField = ({ type = 'text', label, ...props }) => {
  return (
    <div>
      <label><strong>{label}</strong></label>
      <StyledInput type={type} {...props} />
    </div>
  );
};

export default InputField;