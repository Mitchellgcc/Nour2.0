import styled from 'styled-components';

const ImageCard = styled(Card)`
  img {
    width: 100%;
    height: auto;
    border-bottom: 1px solid var(--light-gray);
  }

  .content {
    padding: 16px;
  }
`;

export default ImageCard;
