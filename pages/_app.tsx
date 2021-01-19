import React from "react";
import "../styles/globals.scss";
import "nprogress";
import { PageTransition } from "components/common";
import AuthProvider from "utils/AuthProvider";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <PageTransition
        color="#edbe48"
        startPosition={0.3}
        stopDelayMs={200}
        height={5}
      />
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
