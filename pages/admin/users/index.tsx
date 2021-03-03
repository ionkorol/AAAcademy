import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { Alert, Button, Table } from "react-bootstrap";
import { AdminLayout } from "components/admin";
import { ApiResProp, ParentProp } from "utils/interfaces";
import Link from "next/link";

import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";

import styles from "./Users.module.scss";

interface Props {
  data: ParentProp[];
}
const UsersContent: React.FC<Props> = (props) => {
  const { data } = props;
  const [error, setError] = useState(null);

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h2>Users</h2>
        {error ? <Alert variant="danger"></Alert> : null}
        <div className={styles.controls}>
          <div className={styles.filter}></div>
          <div className={styles.actions}>
            <Link href="/admin/users/add">
              <Button variant="success">Add +</Button>
            </Link>
          </div>
        </div>
        <Table striped hover bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Discount</th>
              <th>Registration Fee</th>
              <th>Registration Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <Link href={`/admin/users/${user.id}`} key={user.id}>
                <tr style={{ cursor: "pointer" }}>
                  <td>
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.hasDiscount ? "True" : "False"}</td>
                  <td>{user.paidRegistration ? "True" : "False"}</td>
                  <td>
                    {user.createdAt.monthName} {user.createdAt.day},{" "}
                    {user.createdAt.year}
                  </td>
                </tr>
              </Link>
            ))}
          </tbody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default UsersContent;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const jsonData = (await (
      await fetch(`${process.env.SERVER}/api/parents`)
    ).json()) as ApiResProp;

    const parentsData = jsonData.data as ParentProp[];

    return {
      props: {
        data: parentsData.sort((a, b) => {
          if (a.createdAt.month > b.createdAt.month) {
            return -1;
          } else if (a.createdAt.month < b.createdAt.month) {
            return 1;
          } else {
            if (a.createdAt.day > b.createdAt.day) {
              return -1;
            } else if (a.createdAt.day < b.createdAt.day) {
              return 1;
            } else {
              return 0;
            }
          }
        }),
      },
    };
  } catch (error) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};
