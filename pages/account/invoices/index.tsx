import { AccountLayout } from "components/account";
import Link from "next/link";
import React from "react";
import { Badge, Col, Container, Row, Table } from "react-bootstrap";
import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";

import styles from "./Invoices.module.scss";
import { ApiResProp, InvoiceProp, ParentProp } from "utils/interfaces";
import { GetServerSideProps } from "next";

interface Props {
  data: InvoiceProp[];
  userData: ParentProp;
}

const Invoices: React.FC<Props> = (props) => {
  const { data, userData } = props;

  console.log(data);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <AccountLayout>
      <Container>
        <h1>Billing</h1>
        <hr></hr>
        <Row className="mb-5 text-dark">
          <Col>
            <h3>Account Balance</h3>
          </Col>
          <Col>
            <h4 className="text-success">
              ${userData.funds.amount.toFixed(2)}
            </h4>
          </Col>
        </Row>
        <Table hover>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item) => (
                <Link href={`/account/invoices/${item.id}`} key={item.id}>
                  <tr role="button">
                    <td>{item.id}</td>
                    <td>
                      {item.invoiceDate.dayName},{" "}
                      {months[item.invoiceDate.month]} {item.invoiceDate.day}{" "}
                      {item.invoiceDate.year}
                    </td>
                    <td>
                      {item.dueDate.dayName}, {months[item.dueDate.month]}{" "}
                      {item.dueDate.day} {item.dueDate.year}
                    </td>
                    <td>${item.total.toFixed(2)}</td>
                    <td>
                      <Badge variant={item.paid ? "success" : "danger"}>
                        {item.paid ? "Paid" : "Unpaid"}
                      </Badge>
                    </td>
                  </tr>
                </Link>
              ))}
          </tbody>
        </Table>
      </Container>
    </AccountLayout>
  );
};

export default Invoices;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);

    const userJsonData = (await (
      await fetch(`${process.env.SERVER}/api/users/parents/${uid}`)
    ).json()) as ApiResProp;

    const res = await fetch(
      `${process.env.SERVER}/api/users/parents/${uid}/invoices`
    );
    const jsonData = (await res.json()) as ApiResProp;
    if (jsonData.status && userJsonData.status) {
      return {
        props: {
          data: jsonData.data,
          userData: userJsonData.data,
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
