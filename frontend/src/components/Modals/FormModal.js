// src/components/Modals/FormModal.js
import React, { useState } from 'react';
import BasicModal from './BasicModal';
import Button from '../Button';
import InputField from '../FormElements/InputField';
import styled from 'styled-components';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <BasicModal isOpen={isOpen} onClose={onClose}>
      <FormContainer onSubmit={handleSubmit}>
        <InputField
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <InputField
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <Button type="submit">Submit</Button>
      </FormContainer>
    </BasicModal>
  );
};

export default FormModal;
