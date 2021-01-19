import React from "react";
import { Navigation } from "../";
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
      </Head>
      <Navigation />
      {props.children}
      <footer className={styles.footer}>
        <div>© Copyright 2020 | Always Active Academy</div>
      </footer>
    </div>
  );
};

export default Layout;
