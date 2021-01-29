import { Layout } from "components/common";
import Link from "next/link";
import React from "react";

import styles from "./layout.module.scss";

interface Props {}

const AccountLayout: React.FC<Props> = (props) => {
  return (
    <Layout title="My Account">
      <div className={styles.container}>
        <div className={styles.menu}>
          <Link href="/account/payment">
            <div className={styles.menuItem}>Invoices</div>
          </Link>
          <Link href="/account/schedule">
            <div className={styles.menuItem}>Invoices</div>
          </Link>
        </div>
        <div className={styles.content}>{props.children}</div>
      </div>
    </Layout>
  );
};

export default AccountLayout;
