// src/components/Lists/SelectableList.js
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
  background-color: ${({ isSelected }) => (isSelected ? '#e0f7fa' : 'transparent')};

  &:last-child {
    border-bottom: none;
  }
`;

const SelectableList = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  return (
    <ListContainer>
      {items.map((item, index) => (
        <ListItem
          key={index}
          isSelected={index === selectedIndex}
          onClick={() => handleSelect(index)}
        >
          {item}
        </ListItem>
      ))}
    </ListContainer>
  );
};

export default SelectableList;
