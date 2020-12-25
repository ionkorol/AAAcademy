import React from "react";
import { AdminLayout } from "../../components";

import styles from "./Admin.module.scss";

interface Props {}

const Admin: React.FC<Props> = (props) => {
  return (
    <AdminLayout>
      Dashboard
    </AdminLayout>
  );
};

export default Admin;
