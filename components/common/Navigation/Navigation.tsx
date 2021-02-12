import React, { useState } from "react";
import Link from "next/link";

import styles from "./navigation.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleAlt, faBars } from "@fortawesome/free-solid-svg-icons";
import useAuth from "hooks/useAuth";

interface Props {}

const Navigation: React.FC<Props> = (props) => {
  const auth = useAuth();

  const [toggle, setToggle] = useState(false);

  return (
    <div className={`${styles.container} ${toggle ? styles.toggled : null}`}>
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
          <Link href="/news">
            <a>News</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="/about">
            <a>About Us</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="/contact">
            <a>Contact Us</a>
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

        {auth.user ? (
          <div className={styles.menuItem}>
            <Link href="/account">
              <button>Account</button>
            </Link>
          </div>
        ) : (
          <div className={styles.menuItem}>
            <Link href="/signup">
              <button>Register</button>
            </Link>
          </div>
        )}
      </div>
      <div onClick={() => setToggle(!toggle)} className={styles.navToggle}>
        <FontAwesomeIcon icon={faBars} fixedWidth size="2x" />
      </div>
    </div>
  );
};

export default Navigation;
