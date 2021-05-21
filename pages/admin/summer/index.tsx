import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { Alert, Button, Container, Table } from "react-bootstrap";
import { AdminLayout } from "components/admin";
import { ApiResProp, ParentProp } from "utils/interfaces";
import Link from "next/link";

import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";

import styles from "./Summer.module.scss";

interface Props {
  data: {
    name: string;
    phone: string;
    medicalCondition: boolean;
    children: {
      id: string;
      firstName: string;
      lastName: string;
      dob: string;
      grade: string;
    }[];
    emergencyContact: {
      email: string;
      phone: string;
    };
    payment: {
      amount: string;
      email: string;
      receiptId: string;
    };
  }[];
}
const Summer: React.FC<Props> = (props) => {
  const { data } = props;
  const [error, setError] = useState(null);

  return (
    <AdminLayout>
      <Container>
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
              <th>Phone</th>
              <th>Children</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr style={{ cursor: "pointer" }} key={index}>
                <td>{user.name}</td>
                <td>{user.payment.email}</td>
                <td>{user.phone}</td>
                <td>{user.children.length}</td>
                <td>{user.payment.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </AdminLayout>
  );
};

export default Summer;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  try {
    const data = await firebaseAdmin.firestore().collection("summer").get();

    return {
      props: {
        data: data.docs.map((item) => item.data()),
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
