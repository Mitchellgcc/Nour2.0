// src/components/FormElements/SelectDropdown.js
import React from 'react';
import styled from 'styled-components';

const StyledSelect = styled.select`
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

const SelectDropdown = ({ options, label, ...props }) => {
  return (
    <div>
      <label><strong>{label}</strong></label>
      <StyledSelect {...props}>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </div>
  );
};

export default SelectDropdown;
