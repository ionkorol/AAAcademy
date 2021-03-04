import React, { useEffect, useState } from "react";
import { Layout } from "components/common";
import { GetServerSideProps } from "next";
import { ClubProp } from "utils/interfaces";

import styles from "./Club.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faChild,
  faClock,
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Icon } from "components/ui";

interface Props {
  data: ClubProp;
}

const Club: React.FC<Props> = (props) => {
  const { data } = props;

  return (
    <Layout title={`${data.title} Club`}>
      <div className={styles.container}>
        <div
          className={styles.slider}
          style={{ backgroundImage: `url(${data.image})` }}
        >
          <div className={styles.inner}>
            <h1>{data.title}</h1>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.info}>
            <div className={styles.location}>
              <Icon icon={faChild} size="2x" bgColor="primary" />
              <span>
                {data.age.from} years TO {data.age.to} years
              </span>
            </div>
            <div className={styles.time}>
              <Icon icon={faClock} size="2x" bgColor="secondary" />
              <span>
                {data.time.from}:00 TO {data.time.to}:00
              </span>
            </div>
            <div className={styles.contact}>
              <Icon icon={faEnvelope} size="2x" bgColor="tertiary" />
              <span>Contact US</span>
            </div>
            <div className={styles.teacher}>
              <Icon icon={faUser} size="2x" bgColor="quaternary" />
              <span>{data.teacher}</span>
            </div>
          </div>
          <div className={styles.description}>
            <div className={styles.text}>
              <h2>DESCRIPTION</h2>
              {data.description ? (
                <span dangerouslySetInnerHTML={{__html: data.description}}></span>
              ) : (
                <span>
                  <p>
                    Lorem commodo lectus at sollicitudin elementum. Sed dolor
                    turpis, condimentum sit amet maximus sit amet, rhoncus non
                    turpis. Aenean convallis ac lorem et sodales. Sed dictum vel
                    orci nec rhoncus. Donec quis porttitor arcu. Nulla ut justo
                    quis augue commodo mattis nec vel ante.
                  </p>
                  <p>
                    Lorem commodo lectus at sollicitudin elementum. Sed dolor
                    turpis, condimentum sit amet maximus sit amet, rhoncus non
                    turpis. Aenean convallis ac lorem et sodales. Sed dictum vel
                    orci nec rhoncus. Donec quis porttitor arcu. Nulla ut justo
                    quis augue commodo mattis nec vel ante.
                  </p>
                  <p>
                    Lorem commodo lectus at sollicitudin elementum. Sed dolor
                    turpis, condimentum sit amet maximus sit amet, rhoncus non
                    turpis. Aenean convallis ac lorem et sodales. Sed dictum vel
                    orci nec rhoncus. Donec quis porttitor arcu. Nulla ut justo
                    quis augue commodo mattis nec vel ante.
                  </p>
                </span>
              )}
            </div>

            <div className={styles.reqs}>
              <h2>REQUIREMENTS</h2>
              <div className={styles.table}>
                <div className={styles.tRow}>
                  <div>COURSE REQUIREMENTS</div>
                  <div></div>
                </div>
                {data.requirements.map((req, index) => (
                  <div className={styles.tRow} key={index}>
                    <div>{req}</div>
                    <div>
                      <Icon icon={faCheck} size="1x" bgColor="quaternary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Club;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { pid } = ctx.query;
    const res = await fetch(`${process.env.SERVER}/api/clubs/${pid}`);
    const jsonData = await res.json();
    if (jsonData.status) {
      return {
        props: {
          data: jsonData.data,
        },
      };
    } else {
      ctx.res.writeHead(301, { Location: "/" });
      ctx.res.end();
      return {
        props: {} as never,
      };
    }
  } catch (error) {
    ctx.res.writeHead(301, { Location: "/" });
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};
