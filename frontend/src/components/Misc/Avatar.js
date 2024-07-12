// src/components/Misc/Avatar.js
import React from 'react';
import styled from 'styled-components';

const AvatarContainer = styled.div`
  display: inline-block;
  width: ${(props) => props.size || '40px'};
  height: ${(props) => props.size || '40px'};
  border-radius: 50%;
  overflow: hidden;
  background-color: #000;
  border: 2px solid ${(props) => props.borderColor || '#ddd'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => props.size ? `${parseInt(props.size) / 2}px` : '20px'};
  color: #fff;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Avatar = ({ src, alt, size, borderColor, initials }) => {
  return (
    <AvatarContainer size={size} borderColor={borderColor}>
      {src ? <AvatarImage src={src} alt={alt} /> : initials}
    </AvatarContainer>
  );
};

export default Avatar;
