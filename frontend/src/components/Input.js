import styled from 'styled-components';

const Input = styled.input`
  padding: 10px;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  font-size: var(--font-size-body1);
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: var(--dark-gray);
    outline: none;
  }

  &::placeholder {
    color: var(--gray);
  }
`;

export default Input;
