import "../styles/globals.css";
import type { AppProps } from "next/app";
import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Wrapper>
      <Component {...pageProps} />
    </Wrapper>
  );
}

export default MyApp;
