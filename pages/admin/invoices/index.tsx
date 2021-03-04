import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { Alert, Badge, Button, Container, Table } from "react-bootstrap";
import { ApiResProp, InvoiceProp, ParentProp } from "utils/interfaces";
import { AdminLayout } from "components/admin";
import Link from "next/link";

import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";

interface Props {
  data: InvoiceProp[];
}
const Invoices: React.FC<Props> = (props) => {
  const { data } = props;

  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);

  const getParents = async () => {
    const fetchedParents = [];
    for (const invoice of data) {
      const parentData = fetchedParents.filter(
        (parent) => parent.id == invoice.parentId
      );

      console.log(fetchedParents);
      if (parentData.length) {
        // If parent was already fetched just use the data
        setInvoices((prevState) => [
          ...prevState,
          {
            ...invoice,
            parentId: `${parentData[0].firstName} ${parentData[0].lastName}`,
          },
        ]);
      } else {
        // Fetch a new parent and use the data
        const jsonData = (await (
          await fetch(`/api/parents/${invoice.parentId}`)
        ).json()) as ApiResProp;
        if (jsonData.status) {
          const parentData = jsonData.data as ParentProp;
          fetchedParents.push(parentData);

          setInvoices((prevState) => [
            ...prevState,
            {
              ...invoice,
              parentId: `${parentData.firstName} ${parentData.lastName}`,
            },
          ]);
        }
      }
    }
  };

  useEffect(() => {
    getParents();
  }, [data]);

  // console.log(fetchedParents);

  return (
    <AdminLayout>
      <Container>
        {error ? <Alert variant="danger"></Alert> : null}
        <div className="bg-secondary p-3 rounded-top">
          <a href="/admin/invoices/add" target="_blank" rel="noreferrer">
            <Button variant="success">Add +</Button>
          </a>
        </div>
        <Table hover bordered striped>
          <thead>
            <tr>
              <th>Title</th>
              <th>User</th>
              <th>Due Date</th>
              <th>Discount</th>
              <th>Registration Fee</th>
              <th>Sub Total</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <Link href={`/admin/invoices/${invoice.id}`} key={invoice.id}>
                <tr style={{ cursor: "pointer" }}>
                  <td>
                    {invoice.id}
                    <Badge variant={invoice.paid ? "success" : "danger"}>
                      P
                    </Badge>
                  </td>
                  <td>{invoice.parentId}</td>
                  <td>
                    {invoice.dueDate.monthName} {invoice.dueDate.day},{" "}
                    {invoice.dueDate.year}
                  </td>
                  <td>${invoice.discount.toFixed(2)}</td>
                  <td>${invoice.registrationFee.toFixed(2)}</td>
                  <td>${invoice.subTotal.toFixed(2)}</td>
                </tr>
              </Link>
            ))}
          </tbody>
        </Table>
      </Container>
    </AdminLayout>
  );
};

export default Invoices;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const jsonData = (await (
      await fetch(`${process.env.SERVER}/api/invoices`)
    ).json()) as ApiResProp;

    if (jsonData.status) {
      const data = jsonData.data.sort((a, b) => b.id - a.id);
      return {
        props: {
          data: data,
        },
      };
    } else {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
