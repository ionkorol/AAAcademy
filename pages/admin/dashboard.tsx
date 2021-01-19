import { GetServerSideProps } from "next";
import React from "react";
import { AdminLayout } from "../../components/admin";

import nookies from "nookies";

import styles from "./Dashboard.module.scss";
import firebaseAdmin from "utils/firebaseAdmin";

interface Props {}

const Dashboard: React.FC<Props> = (props) => {
  return <AdminLayout>Dashboard</AdminLayout>;
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  try {
    const { email } = await firebaseAdmin.auth().verifyIdToken(token);
    return {
      props: {},
    };
  } catch (error) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};
