import React from "react";
import { Navigation, Footer } from "components/common";
import Head from "next/head";
import styles from "./layout.module.scss";

interface Props {
  title: string;
}

const Layout: React.FC<Props> = (props) => {
  const { title } = props;

  return (
    <div className={styles.container}>
      <Head>
        <title>{title} | Always Active Academy</title>
        <script src="https://uat2.hpp.converge.eu.elavonaws.com/client/library.js"></script>
      </Head>
      <Navigation />
      <div className={styles.content}>{props.children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
