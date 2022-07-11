import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { useEndClickEventPosition } from "../../hooks/useEndClickEventPosition";

import { Point } from "../../models/distance";
import { BALL_SIZE } from "../../constants/golf";
import {
  getAngleBetweenTwoPoints,
  getDistanceBetweenTwoPoints,
} from "../../utils/distance";

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

  .shoot-line {
    position: absolute;
    width: 0px;
    height: 0px;
    top: ${BALL_SIZE / 2}px;
    left: ${BALL_SIZE / 2}px;

    &_inner {
      position: absolute;
      top: ${-BALL_SIZE / 8}px;
      height: ${BALL_SIZE / 4}px;
      background-color: #000;
      border-radius: ${BALL_SIZE / 2}px;
    }
  }

  ${(props: { isIn: boolean }) =>
    props.isIn &&
    `
    transform: scale(0);
  `}
`;

const GolfBall = ({ position, isIn, onBallReleased }: GolfBallProps) => {
  const ballRef = useRef(null);
  const { endPosition, resetState, clickedMousePosition } =
    useEndClickEventPosition(ballRef);

  useEffect(() => {
    if (endPosition) {
      onBallReleased(endPosition);
      resetState();
    }
  }, [endPosition, resetState]);

  const lineWidth = clickedMousePosition
    ? getDistanceBetweenTwoPoints(position, clickedMousePosition)
    : 0;
  const lineAngle = clickedMousePosition
    ? (getAngleBetweenTwoPoints(position, clickedMousePosition) * 180) / Math.PI
    : 0;

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
      <div className="ball-shadow" />
      <div
        className="shoot-line"
        style={{ transform: `rotate(${lineAngle}deg)` }}
      >
        <div
          className="shoot-line_inner"
          style={{ width: `${lineWidth < 100 ? lineWidth : 100}px` }}
        />
      </div>
    </Wrapper>
  );
};

export { GolfBall };
