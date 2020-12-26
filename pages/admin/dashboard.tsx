import { GetServerSideProps } from "next";
import React from "react";
import { AdminLayout } from "../../components";

import styles from "./Dashboard.module.scss";

interface Props {}

const Dashboard: React.FC<Props> = (props) => {
  return <AdminLayout>Dashboard</AdminLayout>;
};

export default Dashboard;
