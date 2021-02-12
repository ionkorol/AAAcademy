import { AccountLayout } from "components/account";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
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
  const [transTotal, setTransTotal] = useState(0);

  const accountCredit = userData.funds.amount < 0 ? userData.funds.amount : 0;
  const invoiceTotal = data.total + accountCredit;

  useEffect(() => {
    setTransTotal(0);
    data.transactions.forEach((trans) => {
      setTransTotal((prevState) => prevState + trans.total);
    });
  }, [data.transactions]);

  const handleFreeInvoice = async () => {
    const jsonData = (await (
      await fetch(`/api/invoices/${data.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date().toJSON(),
          id: "0",
          gateway: "Credit",
          total: 0,
        }),
      })
    ).json()) as ApiResProp;

    if (jsonData.status) {
      alert("Invoice Paid");
    } else {
      alert(jsonData.error);
    }
  };

  return (
    <AccountLayout>
      <Container className="text-dark">
        <Row className="mb-5">
          <Col>
            <div>
              <h1>Invoice #{data.id}</h1>
              <Badge variant={data.paid ? "success" : "danger"}>
                {data.paid ? "Paid" : "Unpaid"}
              </Badge>
            </div>
          </Col>
          <Col className="d-flex flex-column">
            <p>
              Invoice Date: {data.invoiceDate.dayName}, {data.invoiceDate.month}
              /{data.invoiceDate.day}/{data.invoiceDate.year}
            </p>
            <p className="my-2">
              {invoiceTotal > 0 ? (
                data.paid ? null : (
                  <PayPalButton
                    amount={invoiceTotal}
                    onSuccess={(details, tData) => {
                      console.log(details, data);
                      fetch(`/api/invoices/${data.id}`, {
                        method: "PATCH",
                        headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          date: details.create_time,
                          id: details.id,
                          gateway: "Paypal",
                          total: Number(
                            details.purchase_units[0].payments.captures[0]
                              .amount.value
                          ),
                        }),
                      });
                    }}
                    style={{ layout: "horizontal", tagline: false }}
                  />
                )
              ) : (
                <button onClick={handleFreeInvoice}>Pay Invoice</button>
              )}
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
              {userData.address.city}, {userData.address.state}{" "}
              {userData.address.postalCode}
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
                              <b>
                                {item.child.firstName} {item.child.lastName} -{" "}
                                {item.club.title}
                              </b>
                            </td>
                            <td></td>
                            <td className="text-right pr-5">
                              ${item.club.price.toFixed(2)}
                            </td>
                          </tr>
                          {item.club.fees.map((fee, index) => (
                            <tr key={index}>
                              <td>
                                <i>{fee.name}</i>
                              </td>
                              <td></td>
                              <td className="text-right pr-5">
                                ${fee.price.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td></td>
                  <td className="text-right">Subtotal</td>
                  <td className="text-right pr-5">
                    ${(data.total + data.discount).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td className="text-right">Discount</td>
                  <td className="text-right pr-5">
                    $-{data.discount.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td className="text-right">Account Credit</td>
                  <td className="text-right pr-5">
                    ${accountCredit.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td className="text-right font-weight-bold">Total</td>
                  <td className="text-right pr-5 font-weight-bold">
                    ${invoiceTotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4 className="mb-3">Transactions</h4>
            <Table>
              <thead>
                <tr>
                  <th>Transaction Date</th>
                  <th>Gateway</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      {transaction.date.dayName}, {transaction.date.month} /{" "}
                      {transaction.date.day} / {transaction.date.year}
                    </td>
                    <td>{transaction.gateway}</td>
                    <td>{transaction.id}</td>
                    <td>${transaction.total.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-light font-weight-bold">
                  <td colSpan={2}></td>
                  <td>Balance</td>
                  <td>${(invoiceTotal - transTotal).toFixed(2)}</td>
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
