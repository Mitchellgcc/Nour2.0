// src/components/FormElements/ToggleSwitch.js
import React from 'react';
import styled from 'styled-components';

const Switch = styled.input`
  display: none;

  &:checked + label::before {
    background-color: var(--primary-color);
    transform: translateX(20px);
  }
`;

const Label = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  background-color: var(--light-gray);
  border-radius: 20px;
  cursor: pointer;
  margin-bottom: var(--spacing-medium);
  vertical-align: middle;

  &::before {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    background-color: var(--white);
    border-radius: 50%;
    transition: 0.3s;
  }
`;

const ToggleSwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-medium);

  & > label:first-of-type {
    margin-right: var(--spacing-small);
  }
`;

const ToggleSwitch = ({ checked, onChange, label }) => {
  return (
    <ToggleSwitchWrapper>
      <label><strong>{label}</strong></label>
      <Switch type="checkbox" checked={checked} onChange={onChange} />
      <Label />
    </ToggleSwitchWrapper>
  );
};

export default ToggleSwitch;
