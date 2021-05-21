import {
  faCalendar,
  faChild,
  faClock,
  faEnvelope,
  faMapPin,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Layout } from "components/common";
import { Icon } from "components/ui";
import Link from "next/link";
import React from "react";
import styles from "./Summer.module.scss";

const Summer = () => {
  return (
    <Layout title="Kids Summer Clubs">
      <div className={styles.container}>
        <div className={styles.slider}>
          <div className={styles.inner}>
            <h1>Kids Summer Clubs</h1>
            <Link href="/register">
              <button>Register Now</button>
            </Link>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.info}>
            <div className={styles.dates}>
              <Icon icon={faCalendar} size="2x" bgColor="quaternary" />
              <span>June 14 - June 18</span>
            </div>
            <div className={styles.time}>
              <Icon icon={faClock} size="2x" bgColor="secondary" />
              <span>9 AM TO 2 PM</span>
            </div>
            <div className={styles.age}>
              <Icon icon={faChild} size="2x" bgColor="primary" />
              <span>Grade 1 - 5</span>
            </div>
            <div className={styles.location}>
              <Icon icon={faMapPin} size="2x" bgColor="tertiary" />
              <span>Friendship Christian School</span>
            </div>
          </div>
          <div className={styles.description}>
            <div className={styles.text}>
              <h2>ABOUT</h2>
              <p>
                Our children and teachers enjoyed every Saturday at Always
                Active Academy, they had a great time learning, playing,
                building friendships and we appreciate everything you have done
                to support your children and our Always Active Academy.
              </p>
              <p>
                We will be having a different schedule for summer, so please
                stay tuned and don't miss our updates.
              </p>
              <p>
                Information regarding our summer program will be posted on our
                website.
              </p>
              <p>We will be having a fun program in JUNE- Summer Clubs!</p>
              <p>WHEN: June 14- June 18 9AM-2 PM</p>{" "}
              <p>A week of Sport, Art, Music and much more... </p>
              <p>Slots for our program are limited, so act fast!!</p>
              <p>Register before June 1st !!</p>
              <p>
                If you have any questions or concerns, please do not hesitate to
                contact us via e-mail or phone.
              </p>
            </div>
            <div className={styles.reqs}>
              <h2>COST</h2>
              <div className={styles.table}>
                <div className={styles.tRow}>
                  <div>SIBLING DISCOUNT</div>
                  <div></div>
                </div>
                <div className={styles.tRow}>
                  <div>1. First Child</div>
                  <div>$200</div>
                </div>
                <div className={styles.tRow}>
                  <div>2. Second Child</div>
                  <div>$150</div>
                </div>
                <div className={styles.tRow}>
                  <div>3. Third Child</div>
                  <div>$100</div>
                </div>
                <div className={styles.tRow}>
                  <div>4+ Fourth Child</div>
                  <div>$100</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Summer;
