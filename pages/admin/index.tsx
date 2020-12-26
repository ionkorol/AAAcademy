import { GetServerSideProps } from "next";
import React from "react";
import { AdminLayout } from "../../components";

interface Props {}

const Admin: React.FC<Props> = (props) => {
  return <div>Admin</div>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    // Some sort of Auth
    ctx.res.statusCode = 302;
    ctx.res.setHeader("Location", "/admin/dashboard");
    ctx.res.end();
    return {
      props: {} as never,
    };
  } catch (error) {
    ctx.res.statusCode = 302;
    ctx.res.setHeader("Location", "/login");
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};
export default Admin;
