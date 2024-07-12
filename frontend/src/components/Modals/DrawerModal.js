// src/components/Modals/DrawerModal.js
import React from 'react';
import styled from 'styled-components';

const DrawerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
`;

const DrawerContainer = styled.div`
  background: white;
  width: 300px;
  height: 100%;
  padding: 20px;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
`;

const DrawerModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <DrawerOverlay onClick={onClose}>
      <DrawerContainer onClick={(e) => e.stopPropagation()}>
        {children}
      </DrawerContainer>
    </DrawerOverlay>
  );
};

export default DrawerModal;
