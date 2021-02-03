import {
  faDochub,
  faFacebook,
  faFacebookF,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faFile,
  faHome,
  faMapPin,
  faMinus,
  faNewspaper,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "components/ui";
import Link from "next/link";
import React from "react";

import styles from "./footer.module.scss";

interface Props {}

const Footer: React.FC<Props> = (props) => {
  return (
    <footer className={styles.container}>
      <div className={styles.content}>
        <div className={styles.about}>
          <h4>ABOUT US</h4>
          <hr />
          <div>
            <Icon icon={faMapPin} size="1x" bgColor="primary" />
            <div>
              <b>Address</b>
              <p>3160 Old Atlanta Rd, Suwanee, GA 30024</p>
            </div>
          </div>
          <div>
            <Icon icon={faEnvelope} size="1x" bgColor="secondary" />
            <div>
              <b>Email</b>
              <p>alwaysactiveacademy@gmail.com</p>
            </div>
          </div>
          <div>
            <Icon icon={faPhone} size="1x" bgColor="tertiary" />
            <div>
              <b>Phone</b>
              <p>470-685-3631</p>
              <p>404-747-6223</p>
            </div>
          </div>
        </div>
        <div className={styles.follow}>
          <h4>FOLLOW US</h4>
          <hr></hr>
          <a href="">
            <Icon icon={faFacebookF} size="1x" bgColor="primary" />
            @alwaysactiveacademy
          </a>
          <a href="">
            <Icon icon={faInstagram} size="1x" bgColor="secondary" />
            @alwaysactiveacademy
          </a>
          <a href="">
            <Icon icon={faEnvelope} size="1x" bgColor="tertiary" />
            alwaysactiveacademy@gmail.com
          </a>
        </div>
        <div className={styles.policies}>
          <h4>POLICIES</h4>
          <hr></hr>
          <Link href="/policy/tos" passHref>
            <a>
              <FontAwesomeIcon icon={faFile} fixedWidth />
              Terms Of Service
            </a>
          </Link>
          <Link href="/policy/covid-release" passHref>
            <a>
              <FontAwesomeIcon icon={faFile} fixedWidth />
              Covid Release and Permissions
            </a>
          </Link>
          <Link href="/" passHref>
            <a>
              <FontAwesomeIcon icon={faFile} fixedWidth />
              Policy One
            </a>
          </Link>
          <Link href="/" passHref>
            <a>
              <FontAwesomeIcon icon={faFile} fixedWidth />
              Policy One
            </a>
          </Link>
        </div>
        <div className={styles.menu}>
          <h4>Menu</h4>
          <hr />
          <Link href="/">
            <a>
              <FontAwesomeIcon icon={faHome} fixedWidth />
              Home
            </a>
          </Link>
          <Link href="/news">
            <a>
              <FontAwesomeIcon icon={faNewspaper} fixedWidth />
              News
            </a>
          </Link>
          <Link href="/account">
            <a>
              <FontAwesomeIcon icon={faUser} fixedWidth />
              Account
            </a>
          </Link>
          <Link href="/contact">
            <a>
              <FontAwesomeIcon icon={faEnvelope} fixedWidth />
              Contact Us
            </a>
          </Link>
        </div>
      </div>
      <div className={styles.copyright}>
        © Copyright 2020 | Always Active Academy
      </div>
    </footer>
  );
};

export default Footer;
