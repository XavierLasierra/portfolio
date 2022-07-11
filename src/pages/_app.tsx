import type { AppProps } from "next/app";
import styled from "styled-components";

import "../styles/globals.css";

const Wrapper = styled.main`
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
