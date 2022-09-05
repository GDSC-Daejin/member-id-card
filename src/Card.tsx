import { motion } from 'framer-motion';
import styled from 'styled-components';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import GDSCLogo from './assets/GDSCLogo.svg';
import { throttle } from './throttle';

const CardWrapper = styled(motion.div)`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
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
  transform-style: preserve-3d;
  position: relative;
  width: 270px;
  height: 428px;
  border-radius: 25px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: background 0.5s;
`;

const TopContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: space-between;
  padding: 30px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  opacity: 0.8;
`;

const CardText = styled.div<{ fontSize: number; lineHeight?: string }>`
  font-weight: 600;
  font-size: ${({ fontSize }) => fontSize}px;
  line-height: 40px;
  ${({ lineHeight }) => lineHeight && `line-height: ${lineHeight};`}
  font-family: 'Google Sans Display', 'Spoqa Han Sans Neo';
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
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  &:focus {
    outline: none;
  }
`;
const RowText = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
`;

const Logo = styled.img`
  width: 34px;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
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
      x: pointX > 20 ? 20 : pointX < -20 ? -20 : pointX,
      y: pointY > 20 ? 20 : pointY < -20 ? -20 : pointY,
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
  const lightX = (scrollPoint.x / 20) * 100;
  //
  const lightY = (scrollPoint.y / 20) * 100;

  const setLight = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.background = `radial-gradient(
      circle at ${tap ? lightX : lightX + 180}% ${lightY}%, #484848, #191919)`;
  }, [scrollPoint, cardRef]);
  setLight();

  useEffect(() => {
    if (!windowRef.current || !cardRef.current) return;
    windowRef.current.addEventListener('touchstart', throttle(mouseDown, 100));
    windowRef.current.addEventListener('touchmove', throttle(mouseMove, 100));
    windowRef.current.addEventListener('touchend', throttle(mouseUp, 100));
    windowRef.current.addEventListener('touchstart', throttle(tapHandler, 100));
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
        transition={{
          duration: 0.3,
        }}
        animate={{
          rotateX: -scrollPoint.y,
          rotateY: tap ? -scrollPoint.x - 180 : -scrollPoint.x,
        }}
      >
        <CardFront>
          <TopContainer>
            <RowText>
              <Logo src={GDSCLogo} />
            </RowText>
            <TextWrapper>
              <CardText fontSize={20}>Lead</CardText>
              <CardText fontSize={40}>Jason</CardText>
              <CardText fontSize={20}>Frontend Developer</CardText>
            </TextWrapper>
          </TopContainer>
        </CardFront>
        <CardBack>
          <TopContainer>
            <div>
              <Logo src={GDSCLogo} />
            </div>
            <TextWrapper>
              <CardText fontSize={20}>정준혁</CardText>
              <CardText fontSize={14}>Frontend Developer</CardText>
              <CardText fontSize={14}>M +82 10.2544.1586</CardText>
              <CardText fontSize={14}>jhjeong00@gmail.com</CardText>
              <CardText fontSize={14}>web.gdsc-dju.com</CardText>
            </TextWrapper>
          </TopContainer>
        </CardBack>
      </CardContainer>
    </CardWrapper>
  );
}
