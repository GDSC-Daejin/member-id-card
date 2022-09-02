import { motion } from 'framer-motion';
import styled from 'styled-components';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const CardWrapper = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardFront = styled(motion.div)`
  position: absolute;
  width: 270px;
  height: 428px;
  display: flex;
  flex-direction: column;
  border-radius: 25px;
  box-shadow: ${({ theme }) => theme.colors.boxShadow100};
  color: #fff;
  cursor: grab;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
`;
const CardBack = styled(CardFront)`
  transform: rotateY(180deg);
`;
const CardContainer = styled(motion.div)`
  perspective: 1000px;
  transform-style: preserve-3d;
  position: relative;
  width: 270px;
  height: 428px;
  border-radius: 25px;
`;

const TopContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: flex-end;
  padding: 30px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  opacity: 0.8;
`;

const CardText = styled.div<{ fontSize: number }>`
  font-weight: 600;
  font-size: ${({ fontSize }) => fontSize}px;
  line-height: 50px;
  font-family: 'Google Sans Display';
  background: linear-gradient(
    112.33deg,
    rgba(255, 255, 255, 0.5) 1.48%,
    #ffe49f 25.91%,
    rgba(255, 255, 255, 0) 113.16%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-text-stroke: 0.4px #ffffff;
  &:focus {
    outline: none;
  }
`;

export function Card() {
  const windowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tap, setTap] = useState(false);

  const downPoint = useRef({
    x: 0,
    y: 0,
  });
  const [scrollPoint, setScrollPoint] = useState({
    x: 0,
    y: 0,
  });
  const mouseDown = (e: TouchEvent) => {
    if (windowRef.current && windowRef.current.style.cursor !== 'grabbing') {
      windowRef.current.style.cursor = 'grabbing';
      downPoint.current.x = e.touches[0].clientX;
      downPoint.current.y = e.touches[0].clientY;
    }
  };
  const mouseMove = (e: TouchEvent) => {
    if (windowRef.current?.style.cursor != 'grabbing') return;
    const upX = e.touches[0].clientX;
    const upY = e.touches[0].clientY;

    const pointX = upX - downPoint.current.x;
    const pointY = upY - downPoint.current.y;

    setScrollPoint({
      ...scrollPoint,
      x: pointX > 30 ? 30 : pointX < -30 ? -30 : pointX,
      y: pointY > 30 ? 30 : pointY < -30 ? -30 : pointY,
    });
  };
  const mouseUp = (e: TouchEvent) => {
    setScrollPoint({
      ...scrollPoint,
      x: scrollPoint.x,
      y: scrollPoint.y,
    });
  };

  let tapedTwice = false;

  function tapHandler(e: TouchEvent) {
    if (!tapedTwice) {
      tapedTwice = true;
      setTimeout(function () {
        tapedTwice = false;
      }, 300);
      return false;
    }
    e.preventDefault();
    //action on double tap goes below
    setTap((prevState) => !prevState);
  }
  const lightX = (scrollPoint.x / 30) * 100;
  //
  const lightY = (scrollPoint.y / 30) * 100;

  const setLight = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.background = `radial-gradient(
      circle at ${tap ? lightX : lightX + 180}% ${lightY}%, #484848, #191919)`;
  }, [scrollPoint, cardRef]);
  setLight();

  useEffect(() => {
    if (!windowRef.current || !cardRef.current) return;
    windowRef.current.addEventListener('touchstart', mouseDown);
    windowRef.current.addEventListener('touchmove', mouseMove);
    windowRef.current.addEventListener('touchend', mouseUp);
    windowRef.current.addEventListener('touchstart', tapHandler);
    cardRef.current.style.background = `radial-gradient(
      circle at ${lightX}% ${lightY}%, #484848, #191919)`;
    return () => {
      if (!windowRef.current) return;
      windowRef.current.removeEventListener('touchstart', mouseDown);
      windowRef.current.removeEventListener('touchmove', mouseMove);
      windowRef.current.removeEventListener('touchend', mouseUp);
    };
  }, []);

  return (
    <CardWrapper ref={windowRef}>
      <CardContainer
        ref={cardRef}
        animate={{
          rotateX: -scrollPoint.y,
          rotateY: tap ? -scrollPoint.x - 180 : -scrollPoint.x,
        }}
      >
        <CardFront>
          <TopContainer>
            <TextWrapper>
              <CardText fontSize={20}>MEMBER</CardText>
              <CardText fontSize={40}>Jason</CardText>
              <CardText fontSize={20}>Frontend Developer</CardText>
            </TextWrapper>
          </TopContainer>
        </CardFront>
        <CardBack>
          <TopContainer>
            <TextWrapper>
              <CardText fontSize={20}>back</CardText>
              <CardText fontSize={40}>Jason</CardText>
              <CardText fontSize={20}>Frontend Developer</CardText>
            </TextWrapper>
          </TopContainer>
        </CardBack>
      </CardContainer>
    </CardWrapper>
  );
}
