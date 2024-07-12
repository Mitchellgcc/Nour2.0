// src/components/Modals/FullscreenModal.js
import React from 'react';
import styled from 'styled-components';

const FullscreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FullscreenModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <FullscreenOverlay onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </FullscreenOverlay>
  );
};

export default FullscreenModal;
