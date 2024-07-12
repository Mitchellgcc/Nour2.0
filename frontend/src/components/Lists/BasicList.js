// src/components/Lists/BasicList.js
import React from 'react';
import styled from 'styled-components';

const ListContainer = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  padding: 8px 16px;
  border-bottom: 1px solid #ccc;

  &:last-child {
    border-bottom: none;
  }
`;

const BasicList = ({ items }) => (
  <ListContainer>
    {items.map((item, index) => (
      <ListItem key={index}>{item}</ListItem>
    ))}
  </ListContainer>
);

export default BasicList;
