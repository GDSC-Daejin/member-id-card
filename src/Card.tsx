import {
  motion,
  transform,
  useDragControls,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import styled, { css } from 'styled-components';
import { ShoesDetails } from './Detail';
import React, { useEffect, useRef, useState } from 'react';

const CardWrapper = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardContainer = styled(motion.div)`
  width: 270px;
  height: 428px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.grey700};
  border-radius: 25px;
  box-shadow: ${({ theme }) => theme.colors.boxShadow100};
  transform-style: preserve-3d;
  perspective: 1000px;
  background: radial-gradient(circle at 100%, #9f9f9f, #191919);
  overflow: hidden;
  color: #fff;
  position: relative;
  cursor: grab;
`;

const CircleWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  overflow: hidden;
  border-top-right-radius: 25px;
`;

const Circle = styled.div`
  position: absolute;
  width: 350px;
  height: 350px;
  top: -4.2em;
  right: -10em;
  z-index: 5;
  background-color: #fbbe01;
  border-radius: 50%;
`;

const TopContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  box-sizing: border-box;
  justify-content: flex-end;
  padding: 30px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const NikeText = styled.div<{ fontSize: number }>`
  font-weight: 600;
  font-size: ${({ fontSize }) => fontSize}px;
  line-height: 50px;
  background: linear-gradient(
    112.33deg,
    rgba(255, 255, 255, 0.5) 1.48%,
    #ffe49f 25.91%,
    rgba(255, 255, 255, 0) 113.16%
  );
  -webkit-text-stroke: 1px #fff;

  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
  &:focus {
    outline: none;
  }
`;

export function Card() {
  const windowRef = useRef<HTMLDivElement>(null);
  const downPoint = useRef({
    x: 0,
    y: 0,
  });
  const [scrollPoint, setScrollPoint] = useState({
    x: 0,
    y: 0,
  });
  const mouseDown = (e: React.TouchEvent<HTMLDivElement>) => {
    if (windowRef.current && windowRef.current.style.cursor !== 'grabbing') {
      // console.log('x down' + e.clientX);
      console.log('y down' + e.touches[0].clientY);
      windowRef.current.style.cursor = 'grabbing';
      downPoint.current.x = e.touches[0].clientX;
      downPoint.current.y = e.touches[0].clientY;
      // console.log(`downPoint: ${downPoint.current.x} ${downPoint.current.y}`);
    }
  };
  const mouseMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (windowRef.current?.style.cursor != 'grabbing') return;
    const upX = e.touches[0].clientX;
    const upY = e.touches[0].clientY;
    console.log(upX);
    console.log(downPoint.current.x);
    // console.log(upY);

    setScrollPoint({
      ...scrollPoint,
      x: upX - downPoint.current.x,
      y: upY - downPoint.current.y,
    });
    console.log(`scrollPoint: ${scrollPoint.x} ${scrollPoint.y}`);
  };
  const mouseUp = (e: React.TouchEvent<HTMLDivElement>) => {
    setScrollPoint({
      ...scrollPoint,
      x: scrollPoint.x % 360,
      y: scrollPoint.y % 360,
    });
  };

  return (
    <CardWrapper
      onTouchMove={mouseMove}
      onTouchEnd={mouseUp}
      onTouchStart={mouseDown}
      ref={windowRef}
    >
      <CardContainer
        animate={{
          rotateX: -scrollPoint.y,
          rotateY: -scrollPoint.x,
        }}
      >
        <TopContainer>
          <TextWrapper>
            <NikeText fontSize={20}>MEMBER</NikeText>
            <NikeText fontSize={40}>Jason</NikeText>
            <NikeText fontSize={20}>Frontend Developer</NikeText>
          </TextWrapper>
        </TopContainer>
      </CardContainer>
    </CardWrapper>
  );
}
