import { Layout } from "components/common";
import { PostCard } from "components/news";
import { GetServerSideProps } from "next";
import React, { useEffect } from "react";
import { ApiResProp, PostProp } from "utils/interfaces";

import styles from "./News.module.scss";
interface Props {
  data: PostProp[];
}

const News: React.FC<Props> = (props) => {
  const { data } = props;

  return (
    <Layout title="News">
      <div className={styles.container}>
        <div className={styles.slider}>
          <div className={styles.inner}>
            <h1>News</h1>
          </div>
        </div>
        <div className={styles.body}>
          {data.map((post) => (
            <PostCard data={post} key={post.id} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default News;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const jsonData = (await (
      await fetch(`${process.env.SERVER}/api/news`)
    ).json()) as ApiResProp;

    if (jsonData.status) {
      return {
        props: {
          data: jsonData.data,
        },
      };
    } else {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
      return {
        props: {} as never,
      };
    }
  } catch (error) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};
