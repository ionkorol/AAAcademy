import React from "react";

import styles from "./Success.module.scss";

interface Props {}

const Success: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Regisetred Successfully</h1>
      <div className={styles.body}>Thank you!</div>
    </div>
  );
};

export default Success;
