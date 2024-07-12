import styled from 'styled-components';

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--light-gray);
  }

  &:disabled {
    color: var(--gray);
    cursor: not-allowed;
  }
`;

export default IconButton;
