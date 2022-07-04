import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { GolfBall } from "../golfBall/GolfBall";

const Wrapper = styled.section`
  flex: 1;
  background-color: green;
`;

const GolfField = () => {
  const fieldRef = useRef(null);
  const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 });

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
      <GolfBall />
    </Wrapper>
  );
};

export { GolfField };
