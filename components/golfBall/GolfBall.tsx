import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useClickEvents } from "../../hooks/useClickEvents";
import {
  getAngleBetweenTwoPoints,
  getDistanceBetweenTwoPoints,
} from "../../utils/distance";

interface GolfBallProps {
  fieldSize?: {
    width: number;
    height: number;
  };
  position?: {
    x: number;
    y: number;
  };
  squareSize?: number;
}

interface Position {
  x: number;
  y: number;
}

interface BallState {
  x: number;
  y: number;
  isMoving: boolean;
}

const Wrapper = styled.button`
  background-color: #fff;
  z-index: 99;
  position: absolute;
  background-color: #fff;
  overlay: none;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  left: ${(props: Position) => props.x}px;
  top: ${(props: Position) => props.y}px;
`;

const GolfBall = ({ fieldSize }: GolfBallProps) => {
  const ballRef = useRef(null);
  const [ballState, setBallState] = useState<BallState>({
    x: 0,
    y: 0,
    isMoving: false,
  });

  const { isDragging, startPosition, endPosition } = useClickEvents(ballRef);

  const moveBall = useCallback(() => {
    if (startPosition === null || endPosition === null || ballState.isMoving)
      return;

    const distance = getDistanceBetweenTwoPoints(
      { x: ballState.x, y: ballState.y },
      endPosition
    );
    const angle = getAngleBetweenTwoPoints(
      { x: ballState.x, y: ballState.y },
      endPosition
    );
    const power = distance / 50;
    const deceleration = 0.02;
    const maxPower = 5;

    let velocityX = (power > maxPower ? maxPower : power) * Math.cos(angle);
    let velocityY = (power > maxPower ? maxPower : power) * Math.sin(angle);
    let previousStateX = ballState.x;
    let previousStateY = ballState.y;

    const render = () => {
      requestAnimationFrame(async () => {
        const newX = previousStateX + velocityX;
        const newY = previousStateY + velocityY;
        console.log(ballState.x, velocityX);

        previousStateX = newX;
        previousStateY = newY;

        let stop = true;
        if (Math.abs(velocityX) >= deceleration) {
          stop = false;
          velocityX =
            velocityX > 0 ? velocityX - deceleration : velocityX + deceleration;
        }
        if (Math.abs(velocityY) >= deceleration) {
          stop = false;
          velocityY =
            velocityY > 0 ? velocityY - deceleration : velocityY + deceleration;
        }
        if (!stop) {
          render();
        } else {
          setBallState((prevState) => ({
            ...prevState,
            isMoving: false,
          }));
        }
        setBallState((prevState) => ({
          ...prevState,
          x: newX,
          y: newY,
        }));
      });
    };

    render();
  }, [startPosition, endPosition]);

  useEffect(() => {
    if (!isDragging && endPosition) {
      moveBall();
    }
  }, [isDragging, endPosition, moveBall]);

  return <Wrapper ref={ballRef} x={ballState.x} y={ballState.y}></Wrapper>;
};

export { GolfBall };
