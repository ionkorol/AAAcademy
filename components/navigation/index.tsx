import React from "react";
import Link from "next/link";

import styles from "./navigation.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAppleAlt } from "@fortawesome/free-solid-svg-icons";

interface Props {}

const Navigation: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <FontAwesomeIcon icon={faAppleAlt} color="#ec7849" fixedWidth />
        <span>Always Active Academy</span>
      </div>
      <div className={styles.menu}>
        <div className={styles.menuItem}>
          <Link href="#">
            <a>Home</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="#">
            <a>Clubs</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="#">
            <a>News</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="#">
            <a>Contacts</a>
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link href="#">
            <button>Sign In</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
