// src/components/Lists/EditableList.js
import React, { useState } from 'react';
import styled from 'styled-components';

const ListContainer = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 8px 16px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const EditableInput = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  width: 100%;
  padding: 0;
`;

const EditableList = ({ items, onEdit }) => {
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(items[index]);
  };

  const handleSave = (index) => {
    onEdit(index, editValue);
    setEditIndex(null);
    setEditValue('');
  };

  return (
    <ListContainer>
      {items.map((item, index) => (
        <ListItem key={index}>
          {editIndex === index ? (
            <EditableInput
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleSave(index)}
            />
          ) : (
            <span onClick={() => handleEdit(index)}>{item}</span>
          )}
        </ListItem>
      ))}
    </ListContainer>
  );
};

export default EditableList;
