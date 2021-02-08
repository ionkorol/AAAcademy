import { AccountLayout } from "components/account";
import { GetServerSideProps } from "next";
import React from "react";
import nookies from "nookies";
import firebaseAdmin from "utils/firebaseAdmin";
import { ApiResProp, InvoiceProp, ParentProp } from "utils/interfaces";
import { Badge, Button, Col, Container, Row, Table } from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";

interface Props {
  data: InvoiceProp;
  userData: ParentProp;
}

const Invoice: React.FC<Props> = (props) => {
  const { data, userData } = props;
  console.log(userData);
  return (
    <AccountLayout>
      <Container className="text-dark">
        <Row className="mb-5">
          <Col>
            <div>
              <h1>Invoice #{data.id}</h1>
              <Badge
                variant={
                  data.status === "Paid"
                    ? "success"
                    : data.status === "Unpaid"
                    ? "secondary"
                    : "danger"
                }
              >
                {data.status}
              </Badge>
            </div>
          </Col>
          <Col className="d-flex flex-column">
            <p>
              Invoice Date: {data.invoiceDate.dayName}, {data.invoiceDate.month}
              /{data.invoiceDate.day}/{data.invoiceDate.year}
            </p>
            <p className="my-2">
              <PayPalButton style={{ layout: "horizontal", tagline: false }} />
            </p>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col>
            <h4>Pay To:</h4>
            <br></br>
            <b>Always Active Academy</b>
            <p>3150 Old Atlanta Rd</p>
            <p>Suwanee, GA 30024</p>
          </Col>
          <Col>
            <h4>Invoiced To:</h4>
            <br></br>
            <b>
              {userData.firstName} {userData.lastName}
            </b>
            <p>{userData.address.addressLine1}</p>
            <p>{userData.address.addressLine2}</p>
            <p>
              {userData.address.adminArea}, GA {userData.address.postalCode}
            </p>
          </Col>
        </Row>
        <Row className="mb-5">
          <Col>
            <h4 className="mb-3">Invoice Items</h4>
            <Table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th></th>
                  <th className="text-right pr-5">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.lineItems.map((item, index) => (
                  <tr key={index}>
                    <td colSpan={3}>
                      <Table borderless>
                        <tbody>
                          <tr>
                            <td>
                              <b>{item.name}</b>
                            </td>
                            <td></td>
                            <td className="text-right pr-5">
                              ${item.price.toFixed(2)}
                            </td>
                          </tr>
                          {item.fees.map((fee, index) => (
                            <tr key={index}>
                              <td></td>
                              <td>{fee.name}</td>
                              <td className="text-right pr-5">
                                ${fee.price.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td></td>
                            <td>Discount</td>
                            <td className="text-right pr-5 text-danger">
                              $({item.discount.toFixed(2)})
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td></td>
                  <td className="text-right font-weight-bold">Total</td>
                  <td className="text-right pr-5 font-weight-bold">
                    ${data.total.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-between">
            <Button>Print</Button>
            <Button>Download</Button>
          </Col>
        </Row>
      </Container>
    </AccountLayout>
  );
};

export default Invoice;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const { token } = nookies.get(ctx);
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const invoiceJsonData = (await (
      await fetch(
        `${process.env.SERVER}/api/users/parents/${uid}/invoices/${id}`
      )
    ).json()) as ApiResProp;
    const userJsonData = (await (
      await fetch(`${process.env.SERVER}/api/users/parents/${uid}`)
    ).json()) as ApiResProp;
    if (invoiceJsonData.status && userJsonData.status) {
      return {
        props: {
          data: invoiceJsonData.data,
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
