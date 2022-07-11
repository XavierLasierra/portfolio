import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { useEndClickEventPosition } from "../../hooks/useEndClickEventPosition";

import { Point } from "../../models/distance";
import { BALL_SIZE } from "../../constants/golf";

interface GolfBallProps {
  position: Point;
  isIn: boolean;
  onBallReleased: (endPosition: Point) => void;
}

const Wrapper = styled.button`
  position: absolute;
  border: none;
  transition: transform 0.2s ease-in-out;
  background-color: transparent;

  .ball {
    position: relative;
    z-index: 99;
    width: ${BALL_SIZE}px;
    height: ${BALL_SIZE}px;
    border-radius: 50%;
    background-color: #fff;
  }

  .ball-shadow {
    position: relative;
    top: -${BALL_SIZE / 1.25}px;
    width: ${BALL_SIZE}px;
    height: ${BALL_SIZE}px;
    border-radius: 50%;
    background-color: #000000aa;
    z-index: 1;
  }

  ${(props: { isIn: boolean }) =>
    props.isIn &&
    `
    transform: scale(0);
  `}
`;

const GolfBall = ({ position, isIn, onBallReleased }: GolfBallProps) => {
  const ballRef = useRef(null);
  const { endPosition, resetState } = useEndClickEventPosition(ballRef);

  useEffect(() => {
    if (endPosition) {
      onBallReleased(endPosition);
      resetState();
    }
  }, [endPosition, resetState]);

  return (
    <Wrapper
      ref={ballRef}
      style={{
        left: position.x - BALL_SIZE / 2,
        top: position.y - BALL_SIZE / 2,
      }}
      isIn={isIn}
    >
      <div className="ball" />
      <div className="ball-shadow"></div>
    </Wrapper>
  );
};

export { GolfBall };
