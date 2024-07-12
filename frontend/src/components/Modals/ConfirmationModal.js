// src/components/Modals/ConfirmationModal.js
import React from 'react';
import BasicModal from './BasicModal';
import Button from '../Button';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => (
  <BasicModal isOpen={isOpen} onClose={onClose}>
    <p>{message}</p>
    <ButtonContainer>
      <Button onClick={onConfirm}>Confirm</Button>
      <Button type="secondary" onClick={onClose}>Cancel</Button>
    </ButtonContainer>
  </BasicModal>
);

export default ConfirmationModal;
