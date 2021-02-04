import { Layout } from "components/common";
import { GetServerSideProps } from "next";
import React from "react";
import { ApiResProp, PostProp } from "utils/interfaces";
import ImageGallery from "react-image-gallery";

import styles from "./NewsPost.module.scss";

interface Props {
  data: PostProp;
}

const NewsPost: React.FC<Props> = (props) => {
  const { data } = props;

  console.log(data);

  return (
    <Layout title={data.title}>
      <div className={styles.container}>
        <div
          className={styles.image}
          style={{ backgroundImage: `url(${data.images[0]})` }}
        >
          <div className={styles.inner}>
            <h2>{data.title}</h2>
            <hr></hr>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.desc}>{data.description}</div>
          <div className={styles.gallery}>
            <ImageGallery
              items={data.images.map((image) => ({
                original: image,
                thumbnail: image,
              }))}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NewsPost;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  try {
    const jsonData = (await (
      await fetch(`${process.env.SERVER}/api/news/${id}`)
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
