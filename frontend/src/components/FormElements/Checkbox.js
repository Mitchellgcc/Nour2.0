// src/components/FormElements/Checkbox.js
import React from 'react';
import styled from 'styled-components';

const StyledCheckbox = styled.input`
  margin-right: 10px;
  vertical-align: middle;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-medium);
`;

const Checkbox = ({ name, checked, onChange, label }) => {
  return (
    <Label>
      <StyledCheckbox
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <strong>{label}</strong>
    </Label>
  );
};

export default Checkbox;
