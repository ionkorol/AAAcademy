import { AccountLayout } from "components/account";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import nookies from "nookies";
import firebaseAdmin from "utils/firebaseAdmin";
import { ApiResProp, InvoiceProp, ParentProp } from "utils/interfaces";
import { Badge, Button, Col, Container, Row, Table } from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";
import { useRouter } from "next/router";

interface Props {
  data: InvoiceProp;
  userData: ParentProp;
}

const Invoice: React.FC<Props> = (props) => {
  const { data, userData } = props;
  const [transTotal, setTransTotal] = useState(0);
  const router = useRouter();

  const accountCredit = userData.funds.amount < 0 ? userData.funds.amount : 0;
  const invoiceTotal =
    data.subTotal + accountCredit - data.discount + data.registrationFee;

  useEffect(() => {
    setTransTotal(0);
    data.transactions.forEach((trans) => {
      setTransTotal((prevState) => prevState + trans.total);
    });
  }, [data.transactions]);

  const handleFreeInvoice = async () => {
    const jsonData = (await (
      await fetch(`/api/parents/${data.parentId}/invoices/${data.id}`, {
        method: "POST",
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
      router.reload();
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
              Invoice Date: {data.invoiceDate.dayName},{" "}
              {data.invoiceDate.monthName} {data.invoiceDate.day}{" "}
              {data.invoiceDate.year}
            </p>
            <p className="my-2">
              {data.paid || !data.subTotal ? null : invoiceTotal ? (
                <PayPalButton
                  amount={invoiceTotal}
                  onSuccess={(details, tData) => {
                    fetch(`/api/parents/${data.parentId}/invoices/${data.id}`, {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        date: details.create_time,
                        id: details.id,
                        gateway: "Paypal",
                        total: Number(
                          details.purchase_units[0].payments.captures[0].amount
                            .value
                        ),
                      }),
                    }).then((res) => {
                      router.reload();
                    });
                  }}
                  options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_API_KEY,
                    disableFunding: "credit",
                  }}
                  style={{ layout: "horizontal", tagline: false }}
                />
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
                  <th className="text-right">Units</th>
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
                                {item.student.firstName} {item.student.lastName}{" "}
                                - {item.club.title}
                              </b>
                            </td>
                            <td className="text-right">
                              {item.quantity} classes
                            </td>
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
                    ${data.subTotal.toFixed(2)}
                  </td>
                </tr>
                {data.registrationFee ? (
                  <tr>
                    <td></td>
                    <td className="text-right">Registration Fee</td>
                    <td className="text-right pr-5">
                      ${data.registrationFee.toFixed(2)}
                    </td>
                  </tr>
                ) : null}
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
            <Button onClick={() => window.print()}>Print</Button>
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
    // Check if user is authenticated
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);

    // Get Invoice data
    const invoiceJsonData = (await (
      await fetch(`${process.env.SERVER}/api/parents/${uid}/invoices/${id}`)
    ).json()) as ApiResProp;

    // Get User data
    const userJsonData = (await (
      await fetch(`${process.env.SERVER}/api/parents/${uid}`)
    ).json()) as ApiResProp;

    // Check if calls are ok
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
