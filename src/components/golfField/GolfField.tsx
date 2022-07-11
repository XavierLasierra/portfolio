import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Point } from "../../models/distance";
import { GolfBall } from "../golfBall/GolfBall";
import { GolfGoal } from "../golfGoal/GolfGoal";

interface GolfFieldProps {
  initialPosition: Point;
}

const Wrapper = styled.section`
  flex: 1;
  background-color: #198e6b;
  position: relative;
  overflow: hidden;
`;

const GolfField = ({ initialPosition }: GolfFieldProps) => {
  const fieldRef = useRef(null);
  const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 });

  const GOAL_POSITION: Point = {
    x: width * 0.6,
    y: height * 0.9,
  };

  const getFieldSize = () => {
    if (fieldRef?.current === null) return;

    const { clientWidth: width, clientHeight: height } = fieldRef.current;
    setDimensions({ width, height });
  };

  useEffect(() => {
    getFieldSize();
    window.addEventListener("resize", getFieldSize);

    return () => window.removeEventListener("resize", getFieldSize);
  }, []);

  return (
    <Wrapper ref={fieldRef}>
      <GolfBall
        fieldSize={{ width, height }}
        point={initialPosition}
        goalPosition={GOAL_POSITION}
      />
      <GolfGoal point={GOAL_POSITION} />
    </Wrapper>
  );
};

export { GolfField };
