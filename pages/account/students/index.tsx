import { AccountLayout, ChildCard } from "components/account";
import { GetServerSideProps } from "next";
import React from "react";

import { ApiResProp, StudentProp } from "utils/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import styles from "./Children.module.scss";

import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";

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
        <Link href="/account/students/register">
          <div className={styles.addChild}>
            Register Student
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
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
