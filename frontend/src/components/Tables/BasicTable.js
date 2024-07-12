// src/components/Tables/BasicTable.js
import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: var(--dark-gray);
  color: white;
`;

const TableBody = styled.tbody`
  tr:nth-child(even) {
    background: var(--light-gray);
  }
`;

const TableRow = styled.tr`
  &:hover {
    background: var(--gray);
  }
`;

const TableCell = styled.td`
  border: 1px solid var(--light-gray);
  padding: 8px;
`;

const BasicTable = ({ headers, data }) => {
  return (
    <Table>
      <TableHead>
        <tr>
          {headers.map((header) => (
            <TableCell key={header}>{header}</TableCell>
          ))}
        </tr>
      </TableHead>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BasicTable;
