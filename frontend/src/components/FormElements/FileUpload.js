// src/components/FormElements/FileUpload.js
import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  display: none;
`;

const Label = styled.label`
  display: inline-block;
  padding: 12px 20px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  background-color: var(--white);
  cursor: pointer;
  font-size: var(--font-size-body1);
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: var(--spacing-medium);

  &:hover {
    background-color: var(--light-gray);
  }
`;

const FileUpload = ({ label, ...props }) => {
  return (
    <div>
      <label><strong>{label}</strong></label>
      <StyledInput id="file-upload" type="file" {...props} />
      <Label htmlFor="file-upload">Choose file</Label>
    </div>
  );
};

export default FileUpload;
