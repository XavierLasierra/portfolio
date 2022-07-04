import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
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
  const [titlePosition, setTitlePosition] = useState<Point>({ x: 0, y: 0 });

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
          <span className="main-text">Hi, I&lsquo;m</span>
          <h1 className="main-text">Xavier Lasierra Pérez</h1>
          <h2 className="main-text">Full Stack Web Developer</h2>
        </div>
      </Wrapper>
      <GolfField
        initialPosition={{
          x: titlePosition.x,
          y: titlePosition.y - BALL_SIZE,
        }}
      />
    </>
  );
};

export default Home;
