import { AccountLayout } from "components/account";
import Link from "next/link";
import React, { useEffect } from "react";
import { Badge, Col, Container, Row, Table } from "react-bootstrap";
import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";

import { ApiResProp, InvoiceProp, ParentProp } from "utils/interfaces";
import { GetServerSideProps } from "next";

import styles from "./Invoices.module.scss";

interface Props {
  data: InvoiceProp[];
  userData: ParentProp;
}

const Invoices: React.FC<Props> = (props) => {
  const { data, userData } = props;

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
                      {item.invoiceDate.dayName}, {item.invoiceDate.monthName}{" "}
                      {item.invoiceDate.day} {item.invoiceDate.year}
                    </td>
                    <td>
                      {item.dueDate.dayName}, {item.dueDate.monthName}{" "}
                      {item.dueDate.day} {item.dueDate.year}
                    </td>
                    <td>${item.subTotal.toFixed(2)}</td>
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
      await fetch(`${process.env.SERVER}/api/parents/${uid}`)
    ).json()) as ApiResProp;

    const invoicesJsonData = (await (
      await fetch(`${process.env.SERVER}/api/parents/${uid}/invoices`)
    ).json()) as ApiResProp;

    const invoicesData = invoicesJsonData.data as InvoiceProp[];

    // If there is no invoice for this week create one
    let exists = false;
    const currentDate = new Date();
    invoicesData.forEach((invoice) => {
      if (
        currentDate.getFullYear() <= invoice.dueDate.year &&
        currentDate.getMonth() <= invoice.dueDate.month &&
        currentDate.getDate() <= invoice.dueDate.day &&
        !invoice.paid
      ) {
        exists = true;
      }
    });
    if (!exists) {
      const newInvoice = (
        await (
          await fetch(`${process.env.SERVER}/api/parents/${uid}/invoices`, {
            method: "POST",
          })
        ).json()
      ).data;
      if (newInvoice) {
        invoicesData.push(newInvoice);
      }
    }
    return {
      props: {
        data: invoicesData,
        userData: userJsonData.data,
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
