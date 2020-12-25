import React from "react";
import Link from "next/link";

import styles from "./adminLayout.module.scss";

interface Props {}

const AdminLayout: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.sidebarMenu}>
        <h2 className={styles.logo}>AAA</h2>
        <hr />
        <Link href="/admin">
          <div className={`${styles.menuItem} ${styles.active}`}>Dashboard</div>
        </Link>
        <Link href="/admin/users">
          <div className={`${styles.menuItem}`}>Users</div>
        </Link>
        <Link href="/admin/clubs">
          <div className={`${styles.menuItem}`}>Clubs</div>
        </Link>
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

export default AdminLayout;
