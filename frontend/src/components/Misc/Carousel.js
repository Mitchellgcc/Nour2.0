// src/components/Misc/Carousel.js
import React, { useState } from 'react';
import styled from 'styled-components';

const CarouselContainer = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const CarouselInner = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(${(props) => props.translate}px);
`;

const CarouselItem = styled.div`
  min-width: 100%;
  box-sizing: border-box;
`;

const Button = styled.button`
  background-color: #333;
  color: #fff;
  border: none;
  padding: 10px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;

  &:disabled {
    background-color: #bbb;
    cursor: not-allowed;
  }
`;

const PrevButton = styled(Button)`
  left: 10px;
`;

const NextButton = styled(Button)`
  right: 10px;
`;

const IndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const Indicator = styled.div`
  width: 10px;
  height: 10px;
  background-color: ${(props) => (props.active ? '#333' : '#bbb')};
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
`;

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleIndicatorClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <CarouselContainer>
      <CarouselInner translate={-currentIndex * 100}>
        {items.map((item, index) => (
          <CarouselItem key={index}>{item}</CarouselItem>
        ))}
      </CarouselInner>
      <PrevButton onClick={handlePrev} disabled={currentIndex === 0}>
        Prev
      </PrevButton>
      <NextButton onClick={handleNext} disabled={currentIndex === items.length - 1}>
        Next
      </NextButton>
      <IndicatorContainer>
        {items.map((_, index) => (
          <Indicator
            key={index}
            active={currentIndex === index}
            onClick={() => handleIndicatorClick(index)}
          />
        ))}
      </IndicatorContainer>
    </CarouselContainer>
  );
};

export default Carousel;
