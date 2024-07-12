// src/components/Misc/Tooltip.js
import React from 'react';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipText = styled.span`
  visibility: hidden;
  width: 150px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%; /* Position the tooltip above the text */
  left: 50%;
  margin-left: -75px;
  opacity: 0;
  transition: opacity 0.3s, bottom 0.3s;

  ${TooltipContainer}:hover & {
    visibility: visible;
    opacity: 1;
    bottom: 150%;
  }
`;

const Tooltip = ({ children, text }) => {
  return (
    <TooltipContainer>
      {children}
      <TooltipText>{text}</TooltipText>
    </TooltipContainer>
  );
};

export default Tooltip;
