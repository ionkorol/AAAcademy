import { Layout } from "components/common";
import React from "react";

import styles from "./About.module.scss";

const About = () => {
  return (
    <Layout title="About Us">
      <div className={styles.container}>
        <div className={styles.slider}>
          <div className={styles.inner}>
            <h1>About Us</h1>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.image}>
            <img
              src="https://3toh891af6rf1cn1po1ecevj-wpengine.netdna-ssl.com/wp-content/uploads/2018/03/coding-class-kids-1024x683.jpg"
              alt=""
            />
          </div>
          <div className={styles.text}>
            <h2 className="mb-5">About Always Active Academy</h2>
            <p>
              At Always Active Academy, we do more than just activities and
              clubs, we do friendship. We are here to be your friend and to do
              what a friend does - spend time with you.
            </p>
            <p>
              At Always Active Academy, we know the importance of community that
              {`'`}s why we lend a hand to support our children and families.
              Have fun, socialize and make new friends. Feel secure and safe in
              a familiar place; enjoy a range of activities & play.
            </p>
            <p>
              We accept children ages 5+ and their families seeking an
              exceptional learning environment with contemporary approaches. We
              offer active, creative, music and educational classes/clubs for
              elementary, middle and high school children.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
