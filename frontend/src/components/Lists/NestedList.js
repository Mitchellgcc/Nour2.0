// src/components/Lists/NestedList.js
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

const NestedList = ({ items }) => (
  <ListContainer>
    {items.map((item, index) => (
      <ListItem key={index}>
        {item.title}
        {item.children && <NestedList items={item.children} />}
      </ListItem>
    ))}
  </ListContainer>
);

export default NestedList;
