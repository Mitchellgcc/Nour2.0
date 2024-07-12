// src/components/FormElements/Textarea.js
import React from 'react';
import styled from 'styled-components';

const StyledTextarea = styled.textarea`
  border: 1px solid var(--light-gray);
  padding: 12px;
  border-radius: 4px;
  font-size: var(--font-size-body1);
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  margin-bottom: var(--spacing-medium);

  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
  
  &:hover {
    border-color: var(--primary-light);
  }
`;

const Textarea = ({ label, ...props }) => {
  return (
    <div>
      <label><strong>{label}</strong></label>
      <StyledTextarea {...props} />
    </div>
  );
};

export default Textarea;
