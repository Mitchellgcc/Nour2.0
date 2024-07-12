// src/components/FormElements/RadioButton.js
import React from 'react';
import styled from 'styled-components';

const StyledRadio = styled.input`
  margin-right: 10px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-medium);
`;

const RadioButton = ({ name, value, checked, onChange, label }) => {
  return (
    <Label>
      <StyledRadio
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <strong>{label}</strong>
    </Label>
  );
};

export default RadioButton;
