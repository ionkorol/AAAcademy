import React from "react";
import Link from "next/link";

import styles from "./AdminLayout.module.scss";
import { useRouter } from "next/router";

interface Props {}

const AdminLayout: React.FC<Props> = (props) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.sidebarMenu}>
        <Link href="/" passHref>
          <a>
            <h2 className={styles.logo}>AAA</h2>
          </a>
        </Link>
        <hr />
        <Link href="/admin">
          <div
            className={`${styles.menuItem} ${
              router.pathname.includes("dashboard") ? styles.active : null
            }`}
          >
            Dashboard
          </div>
        </Link>
        <Link href="/admin/users">
          <div
            className={`${styles.menuItem} ${
              router.pathname.includes("users") ? styles.active : null
            }`}
          >
            Users
          </div>
        </Link>
        <Link href="/admin/clubs">
          <div
            className={`${styles.menuItem} ${
              router.pathname.includes("clubs") ? styles.active : null
            }`}
          >
            Clubs
          </div>
        </Link>
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  );
};

export default AdminLayout;
