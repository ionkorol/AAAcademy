import { useRouter } from "next/router";
import React from "react";
import { PostProp } from "utils/interfaces";

import styles from "./postCard.module.scss";

interface Props {
  data: PostProp;
}

const PostCard: React.FC<Props> = (props) => {
  const { data } = props;

  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/news/${data.id}`)}
      className={styles.container}
    >
      <div className={styles.image}>
        <img src={data.images[0]} width="300" height="300" alt="" />
      </div>
      <div className={styles.body}>
        <div className={styles.title}>
          <h2>{data.title}</h2>
        </div>
        <hr></hr>
        <div className={styles.description}>{data.description}</div>
      </div>
    </div>
  );
};

export default PostCard;
