import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { BALL_SIZE, MAX_POWER, POWER_MULTIPLIER } from "../../constants/golf";
import { useClickEvents } from "../../hooks/useClickEvents";
import { Point } from "../../models/distance";
import {
  getAngleBetweenTwoPoints,
  getDistanceBetweenTwoPoints,
} from "../../utils/distance";

interface GolfBallProps {
  fieldSize: {
    width: number;
    height: number;
  };
  point?: Point;
  goalPosition: Point;
}

interface BallState extends Point {
  isMoving: boolean;
  isIn: boolean;
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

  ${(props: BallState) =>
    props.isIn &&
    `
    transform: scale(0);
  `}
`;

const GolfBall = ({ fieldSize, point, goalPosition }: GolfBallProps) => {
  const ballRef = useRef(null);
  const [ballState, setBallState] = useState<BallState>({
    x: (point?.x || 0) + BALL_SIZE / 2,
    y: (point?.y || 0) + BALL_SIZE / 2,
    isMoving: false,
    isIn: false,
  });

  const { isDragging, endPosition } = useClickEvents(ballRef);

  const checkCollision = (point: Point): ("horizontal" | "vertical")[] => {
    if (fieldSize === undefined) return [];

    const { width, height } = fieldSize;
    const collisions: ("horizontal" | "vertical")[] = [];
    if (point.x - BALL_SIZE / 2 <= 0) collisions.push("horizontal");
    if (point.x + BALL_SIZE / 2 >= width) collisions.push("horizontal");
    if (point.y - BALL_SIZE / 2 <= 0) collisions.push("vertical");
    if (point.y + BALL_SIZE / 2 >= height) collisions.push("vertical");

    return collisions;
  };

  const onBallIn = () => {
    setBallState({
      ...goalPosition,
      isMoving: false,
      isIn: true,
    });
  };

  const checkGoal = (
    point: Point,
    increment: number
  ): "collision" | "in" | "out" => {
    const { x, y } = point;
    const { x: goalX, y: goalY } = goalPosition;
    const goalDistance = getDistanceBetweenTwoPoints(
      { x: goalX, y: goalY },
      { x, y }
    );
    const goalRadius = BALL_SIZE / 2;
    if (goalDistance < goalRadius) {
      if (increment < MAX_POWER / 2) return "in";
      return "collision";
    }
    return "out";
  };

  useEffect(() => {
    setBallState({
      x: (point?.x || 0) + BALL_SIZE / 2,
      y: (point?.y || 0) + BALL_SIZE / 2,
      isMoving: false,
      isIn: false,
    });
  }, [point]);

  useEffect(() => {
    if (!isDragging && endPosition && !ballState.isMoving) {
      const startMovement = () => {
        const ballPoint: Point = { x: ballState.x, y: ballState.y };
        const distance = getDistanceBetweenTwoPoints(ballPoint, endPosition);
        const angle = getAngleBetweenTwoPoints(ballPoint, endPosition);

        const power = distance * POWER_MULTIPLIER;
        const frictionDecrementX =
          (Math.abs(0.02 * Math.cos(angle)) / 2) * Math.PI;
        const frictionDecrementY =
          (Math.abs(0.02 * Math.sin(angle)) / 2) * Math.PI;
        let incrementX =
          (power > MAX_POWER ? MAX_POWER : power) * Math.cos(angle);
        let incrementY =
          (power > MAX_POWER ? MAX_POWER : power) * Math.sin(angle);

        const moveToNextPoint = (previousPoint: Point) => {
          requestAnimationFrame(async () => {
            const newX = previousPoint.x + incrementX;
            const newY = previousPoint.y + incrementY;

            const newPoint: Point = { x: newX, y: newY };
            const collisions = checkCollision({ x: newX, y: newY });
            if (collisions.length > 0) {
              collisions.forEach((collision) => {
                if (collision === "horizontal") {
                  incrementX = -incrementX;
                  newPoint.x += incrementX * 2;
                } else if (collision === "vertical") {
                  incrementY = -incrementY;
                  newPoint.y += incrementY * 2;
                }
              });
            }

            let stop = true;

            if (Math.abs(incrementX) > frictionDecrementX) {
              stop = false;
              incrementX =
                incrementX > 0
                  ? incrementX - frictionDecrementX
                  : incrementX + frictionDecrementX;
            }
            if (Math.abs(incrementY) > frictionDecrementY) {
              stop = false;
              incrementY =
                incrementY > 0
                  ? incrementY - frictionDecrementY
                  : incrementY + frictionDecrementY;
            }

            const isGoal = checkGoal(
              newPoint,
              Math.abs(incrementX) + Math.abs(incrementY)
            );
            if (isGoal === "collision") {
              console.log("out");
            }
            if (isGoal === "in") {
              return onBallIn();
            }

            setBallState({
              ...newPoint,
              isMoving: !stop,
              isIn: false,
            });

            if (!stop) {
              moveToNextPoint(newPoint);
            }
          });
        };

        moveToNextPoint(ballState);
      };

      startMovement();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, endPosition]);

  return (
    <Wrapper
      ref={ballRef}
      style={{
        left: ballState.x - BALL_SIZE / 2,
        top: ballState.y - BALL_SIZE / 2,
      }}
      {...ballState}
    >
      <div className="ball" />
      <div className="ball-shadow"></div>
    </Wrapper>
  );
};

export { GolfBall };
