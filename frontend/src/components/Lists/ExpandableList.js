// src/components/Lists/ExpandableList.js
import React, { useState } from 'react';
import styled from 'styled-components';

const ListContainer = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 8px 16px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;

const ExpandableContent = styled.div`
  padding: 8px 16px;
  background-color: #f9f9f9;
`;

const ExpandableList = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <ListContainer>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ListItem onClick={() => handleToggle(index)}>{item.title}</ListItem>
          {expandedIndex === index && <ExpandableContent>{item.content}</ExpandableContent>}
        </React.Fragment>
      ))}
    </ListContainer>
  );
};

export default ExpandableList;
