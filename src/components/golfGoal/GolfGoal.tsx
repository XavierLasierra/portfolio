import React from "react";
import styled from "styled-components";
import { BALL_SIZE } from "../../constants/golf";
import { Point } from "../../models/distance";

interface GolfGoalProps {
  position: Point;
}

const Wrapper = styled.div`
  border-radius: 55% 45% 55% 45%;
  transform: rotate(45deg);
  background-color: grey;
  position: absolute;
  width: ${BALL_SIZE * 1.5}px;
  height: ${BALL_SIZE * 1.5}px;
  left: ${(props: Point) => props.x - (BALL_SIZE * 1.5) / 2}px;
  top: ${(props: Point) => props.y - (BALL_SIZE * 1.5) / 2}px;
  display: flex;
  overflow: hidden;

  .bottom {
    border-radius: 55% 45% 55% 45%;
    background-color: #000;
    width: ${BALL_SIZE * 1.5}px;
    height: ${BALL_SIZE * 1.5}px;
    left: ${(props: Point) => props.x - (BALL_SIZE * 1.5) / 2}px;
    top: ${(props: Point) => props.y - (BALL_SIZE * 1.5) / 2}px;
    transform: translate(10%, 10%);
  }
`;

const GolfGoal = ({ position }: GolfGoalProps) => {
  return (
    <Wrapper x={position.x} y={position.y}>
      <div className="bottom"></div>
    </Wrapper>
  );
};

export { GolfGoal };
