import React from "react";
import "../styles/globals.scss";
import "nprogress";
import { PageTransition } from "components/common";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <PageTransition
        color="#edbe48"
        startPosition={0.3}
        stopDelayMs={200}
        height={5}
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
