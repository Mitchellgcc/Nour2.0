// src/components/Misc/Accordion.js
import React, { useState } from 'react';
import styled from 'styled-components';

const AccordionContainer = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
`;

const AccordionHeader = styled.div`
  background-color: #f9f9f9;
  cursor: pointer;
  padding: 10px;
  border-bottom: 1px solid #ccc;

  &:last-child {
    border-bottom: none;
  }
`;

const AccordionContent = styled.div`
  padding: 10px;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  background-color: #fff;
  transition: max-height 0.3s ease-in-out;
`;

const Accordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <AccordionContainer>
      {items.map((item, index) => (
        <div key={index}>
          <AccordionHeader onClick={() => handleClick(index)}>
            {item.title}
          </AccordionHeader>
          <AccordionContent isOpen={openIndex === index}>
            {item.content}
          </AccordionContent>
        </div>
      ))}
    </AccordionContainer>
  );
};

export default Accordion;
