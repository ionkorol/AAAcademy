import { AccountLayout, ChildCard } from "components/account";
import { GetServerSideProps } from "next";
import React from "react";
import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";

import styles from "./Children.module.scss";
import { ApiResProp, StudentProp } from "utils/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface Props {
  data?: StudentProp[];
  error?: any;
}

const Children: React.FC<Props> = (props) => {
  const { data, error } = props;
  return (
    <AccountLayout>
      <div className={styles.container}>
        {data.map((child) => (
          <ChildCard data={child} key={child.id} />
        ))}
        <Link href="/account/children/register">
          <div className={styles.addChild}>
            Register Child
            <FontAwesomeIcon icon={faPlus} fixedWidth size="2x" />
          </div>
        </Link>
      </div>
    </AccountLayout>
  );
};

export default Children;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const jsonData = (await (
      await fetch(`${process.env.SERVER}/api/parents/${uid}/students`)
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
