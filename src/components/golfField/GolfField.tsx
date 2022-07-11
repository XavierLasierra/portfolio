import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { GolfBall } from "../golfBall/GolfBall";
import { GolfGoal } from "../golfGoal/GolfGoal";

import { BALL_SIZE, MAX_POWER, POWER_MULTIPLIER } from "../../constants/golf";
import { Point } from "../../models/distance";
import {
  getAngleBetweenTwoPoints,
  getDistanceBetweenTwoPoints,
  getRandomPoint,
} from "../../utils/distance";

interface GolfFieldProps {
  initialBallPosition?: Point;
}

const Wrapper = styled.section`
  flex: 1;
  position: relative;
  overflow: hidden;
`;

interface BallState {
  position: Point;
  isMoving: boolean;
  isIn: boolean;
}

const GolfField = ({ initialBallPosition }: GolfFieldProps) => {
  const fieldRef = useRef<HTMLElement>(null);
  const [dimensions, setDimensions] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const [ballState, setBallState] = useState<BallState>({
    position: initialBallPosition || getRandomPoint(dimensions),
    isMoving: false,
    isIn: false,
  });

  const checkCollision = (point: Point): ("horizontal" | "vertical")[] => {
    const { top, bottom, left, right } = dimensions;
    const collisions: ("horizontal" | "vertical")[] = [];
    if (point.x - BALL_SIZE / 2 <= left) collisions.push("horizontal");
    if (point.x + BALL_SIZE / 2 >= right) collisions.push("horizontal");
    if (point.y - BALL_SIZE / 2 <= top) collisions.push("vertical");
    if (point.y + BALL_SIZE / 2 >= bottom) collisions.push("vertical");

    return collisions;
  };

  const onBallIn = () => {
    setBallState({
      position: goalPosition,
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

  const onBallReleased = (endPosition: Point) => {
    if (ballState.isMoving) return;
    const ballPoint: Point = ballState.position;
    const distance = getDistanceBetweenTwoPoints(ballPoint, endPosition);
    const angle = getAngleBetweenTwoPoints(ballPoint, endPosition);

    const power = distance * POWER_MULTIPLIER;
    const frictionDecrementX = (Math.abs(0.02 * Math.cos(angle)) / 2) * Math.PI;
    const frictionDecrementY = (Math.abs(0.02 * Math.sin(angle)) / 2) * Math.PI;
    let incrementX = (power > MAX_POWER ? MAX_POWER : power) * Math.cos(angle);
    let incrementY = (power > MAX_POWER ? MAX_POWER : power) * Math.sin(angle);

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
          position: newPoint,
          isMoving: !stop,
          isIn: false,
        });

        if (!stop) {
          moveToNextPoint(newPoint);
        }
      });
    };

    moveToNextPoint(ballState.position);
  };

  const goalPosition: Point = useMemo(() => {
    const ballPosition = ballState.position;
    let goalPosition;
    do {
      goalPosition = getRandomPoint(dimensions);
    } while (
      getDistanceBetweenTwoPoints(ballPosition, goalPosition) <
      BALL_SIZE * 2
    );
    return goalPosition;
  }, [dimensions]);

  const getFieldSize = () => {
    if (fieldRef?.current === null) return;

    const { top, left, right, bottom } =
      fieldRef.current.getBoundingClientRect();
    setDimensions({ top, left, right, bottom });
  };

  useEffect(() => {
    getFieldSize();

    window.addEventListener("resize", getFieldSize);
    return () => window.removeEventListener("resize", getFieldSize);
  }, []);

  return (
    <Wrapper ref={fieldRef}>
      <GolfBall
        position={ballState.position}
        isIn={ballState.isIn}
        onBallReleased={onBallReleased}
      />
      <GolfGoal position={goalPosition} />
    </Wrapper>
  );
};

export { GolfField };
