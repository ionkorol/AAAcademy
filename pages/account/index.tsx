import React from "react";
import { AccountLayout } from "components/account";

import styles from "./Account.module.scss";
import { GetServerSideProps } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";
import { UserProp } from "utils/interfaces";

interface Props {
  data: UserProp;
  error: any;
}

const Account: React.FC<Props> = (props) => {
  const { data, error } = props;

  return (
    <AccountLayout>
      <div className={styles.container}>
        Hello, {data.firstName} {data.lastName}
      </div>
    </AccountLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const res = await fetch(`${process.env.SERVER}/api/users/parents/${uid}`);
    const jsonData = await res.json();
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

export default Account;
