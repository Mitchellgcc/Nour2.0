import React from 'react';
import styled from 'styled-components';

const BreadcrumbsContainer = styled.nav`
  display: flex;
  align-items: center;
  font-size: var(--font-size-body2);
`;

const BreadcrumbItem = styled.span`
  color: var(--primary-color);

  &:not(:last-child)::after {
    content: '>';
    margin: 0 8px;
    color: var(--gray);
  }
`;

const Breadcrumbs = ({ items }) => {
  return (
    <BreadcrumbsContainer>
      {items.map((item, index) => (
        <BreadcrumbItem key={index}>{item}</BreadcrumbItem>
      ))}
    </BreadcrumbsContainer>
  );
};

export default Breadcrumbs;
