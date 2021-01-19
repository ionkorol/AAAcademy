import React from "react";
import Link from "next/link";

import styles from "./navigation.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleAlt } from "@fortawesome/free-solid-svg-icons";
import useAuth from "hooks/useAuth";

interface Props {}

const Navigation: React.FC<Props> = (props) => {
  const auth = useAuth();

  return (
    <div className={styles.container}>
      <Link href="/">
        <a className={styles.logo}>
          <FontAwesomeIcon icon={faAppleAlt} color="#ec7849" fixedWidth />
          <span>Always Active Academy</span>
        </a>
      </Link>
      <div className={styles.menu}>
        <div className={styles.menuItem}>
          <Link href="/">
            <a>Home</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="/clubs">
            <a>Clubs</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="/news">
            <a>News</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="/contact">
            <a>Contacts</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          {auth.user ? (
            <button onClick={auth.signOut}>Sign Out</button>
          ) : (
            <Link href="/signin">
              <button>Sign In</button>
            </Link>
          )}
        </div>
        <div className={styles.menuItem}>
          <Link href="/signup">
            <button>Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
