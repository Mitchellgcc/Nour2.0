import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: var(--spacing-small);
`;

const PageNumber = styled.button`
  background: none;
  border: none;
  color: var(--black);
  margin: 0 4px;
  cursor: pointer;
  font-size: var(--font-size-body2);

  &:hover {
    text-decoration: underline;
  }

  &.active {
    font-weight: bold;
    text-decoration: underline;
  }
`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map(num => num + 1);

  return (
    <PaginationContainer>
      {pages.map(page => (
        <PageNumber
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </PageNumber>
      ))}
    </PaginationContainer>
  );
};

export default Pagination;
