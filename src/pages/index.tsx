import { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import styled from "styled-components";

import { GolfField } from "../components/golfField/GolfField";
import { BALL_SIZE } from "../constants/golf";

import { Point } from "../models/distance";

const Wrapper = styled.div`
  position: absolute;
  z-index: 1;

  .main-title {
    text-align: right;
    margin-right: ${BALL_SIZE}px;
  }

  .main-text {
    font-size: 3rem;
    color: #fff;
    font-weight: normal;
  }
`;

const Home: NextPage = () => {
  const mainTitleRef = useRef(null);
  const [titlePosition, setTitlePosition] = useState<Point | null>(null);

  const getTitleSize = () => {
    if (mainTitleRef?.current === null) return;

    const { clientWidth: x, clientHeight: y } = mainTitleRef.current;
    setTitlePosition({ x, y });
  };

  useEffect(() => {
    getTitleSize();
    window.addEventListener("resize", getTitleSize);

    return () => window.removeEventListener("resize", getTitleSize);
  }, []);

  return (
    <>
      <Wrapper>
        <div ref={mainTitleRef} className="main-title">
          <span className="main-text">Test</span>
          <h1 className="main-text">Test test test</h1>
          <h2 className="main-text">test test set s tet estest</h2>
        </div>
      </Wrapper>
      {titlePosition && (
        <GolfField
          initialBallPosition={{
            x: titlePosition.x,
            y: titlePosition.y - BALL_SIZE,
          }}
        />
      )}
    </>
  );
};

export default Home;
