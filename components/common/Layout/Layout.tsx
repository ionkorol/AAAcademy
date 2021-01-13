import React from "react";
import { Navigation } from "../";
import styles from "./layout.module.scss";

interface Props {}

const Layout: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <Navigation />
      {props.children}
      <footer className={styles.footer}>
        <div>© Copyright 2020 | Always Active Academy</div>
      </footer>
    </div>
  );
};

export default Layout;
