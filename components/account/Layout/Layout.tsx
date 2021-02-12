import { Layout } from "components/common";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import styles from "./layout.module.scss";

interface Props {}

const AccountLayout: React.FC<Props> = (props) => {
  const [activePath, setActivePath] = useState<
    "dashboard" | "children" | "invoices" 
  >("dashboard");

  const router = useRouter();
  useEffect(() => {
    if (router.pathname.includes("children")) {
      setActivePath("children");
    } else if (router.pathname.includes("invoices")) {
      setActivePath("invoices");
    } else {
      setActivePath("dashboard");
    }
  }, [router.pathname]);

  return (
    <Layout title="My Account">
      <div className={styles.container}>
        <div className={styles.slider}>
          <div className={styles.inner}>
            <h1>Account</h1>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.menu}>
            <Link href="/account">
              <div
                className={`${styles.menuItem} ${
                  activePath === "dashboard" ? styles.active : null
                }`}
              >
                Dashboard
              </div>
            </Link>
            <Link href="/account/children">
              <div
                className={`${styles.menuItem} ${
                  activePath === "children" ? styles.active : null
                }`}
              >
                Children
              </div>
            </Link>
            <Link href="/account/invoices">
              <div
                className={`${styles.menuItem} ${
                  activePath === "invoices" ? styles.active : null
                }`}
              >
                Invoices
              </div>
            </Link>
          </div>
          <div className={styles.content}>{props.children}</div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountLayout;
