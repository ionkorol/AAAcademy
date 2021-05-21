import { Layout } from "components/common";
import React from "react";
import styles from "./Thankyou.module.scss";

const ThankYou = () => {
  return (
    <Layout title="Thank you">
      <div className={styles.container}>
        <div className={styles.slider}>
          <div className={styles.inner}>
            <h1>Thank you for your registration!</h1>
            <hr></hr>
          </div>
        </div>
        <div className={styles.body}></div>
      </div>
    </Layout>
  );
};

export default ThankYou;
