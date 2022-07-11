import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { GolfBall } from "../golfBall/GolfBall";
import { GolfGoal } from "../golfGoal/GolfGoal";

import { BALL_SIZE } from "../../constants/golf";
import { Point } from "../../models/distance";
import {
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

const GolfField = ({ initialBallPosition }: GolfFieldProps) => {
  const fieldRef = useRef<HTMLElement>(null);
  const [dimensions, setDimensions] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  const { ballPosition, goalPosition } = useMemo(() => {
    const ballPosition = initialBallPosition || getRandomPoint(dimensions);
    let goalPosition;
    do {
      goalPosition = getRandomPoint(dimensions);
      console.log(ballPosition, goalPosition);
    } while (
      getDistanceBetweenTwoPoints(ballPosition, goalPosition) <
      BALL_SIZE * 2
    );
    return {
      ballPosition,
      goalPosition,
    };
  }, [initialBallPosition, dimensions]);

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
        fieldDimensions={dimensions}
        position={ballPosition}
        goalPosition={goalPosition}
      />
      <GolfGoal position={goalPosition} />
    </Wrapper>
  );
};

export { GolfField };
