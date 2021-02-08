import { AccountLayout } from "components/account";
import Link from "next/link";
import React from "react";
import { Badge, Container, Table } from "react-bootstrap";
import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";

import styles from "./Invoices.module.scss";
import { ApiResProp, InvoiceProp } from "utils/interfaces";
import { GetServerSideProps } from "next";

interface Props {
  data: InvoiceProp[];
}

const Invoices: React.FC<Props> = (props) => {
  const { data } = props;

  console.log(data);

  return (
    <AccountLayout>
      <Container>
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
                      {item.invoiceDate.dayName}, {item.invoiceDate.month}/
                      {item.invoiceDate.day}/{item.invoiceDate.year}
                    </td>
                    <td>
                      {item.dueDate.dayName}, {item.dueDate.month}/
                      {item.dueDate.day}/{item.dueDate.year}
                    </td>
                    <td>${item.total.toFixed(2)}</td>
                    <td>
                      <Badge
                        variant={
                          item.status === "Paid"
                            ? "success"
                            : item.status === "Unpaid"
                            ? "secondary"
                            : "danger"
                        }
                      >
                        {item.status}
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
    const res = await fetch(
      `${process.env.SERVER}/api/users/parents/${uid}/invoices`
    );
    const jsonData = (await res.json()) as ApiResProp;
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
