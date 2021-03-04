import { GetServerSideProps } from "next";
import React from "react";
import nookies from "nookies";
import firebaseAdmin from "utils/firebaseAdmin";

interface Props {}

const Admin: React.FC<Props> = (props) => {
  return <div>Admin</div>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    return {
      redirect: {
        destination: "/admin/dashboard",
        permanent: false,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
};
export default Admin;
