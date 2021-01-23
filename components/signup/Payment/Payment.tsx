import React, { useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, ListGroup, Alert } from "react-bootstrap";
import { ChildProp, ClubProp, UserProp } from "utils/interfaces";
import { CreateOrderObj } from "./interfaces";

import styles from "./Payment.module.scss";

interface Props {
  handleSignup: () => Promise<boolean>;
  navigation: React.Dispatch<any>;
  childData: ChildProp[];
  parentData: UserProp;
}

const Payment: React.FC<Props> = (props) => {
  const { handleSignup, navigation, childData, parentData } = props;

  const [totalPrice, setTotalPrice] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [priceDiscounted, setPriceDiscounted] = useState(false);

  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paypal = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_API_KEY}`;
    //For head
    document.head.appendChild(script);
    script.onload = () => {
      onRun(childData, parentData, handleSubmit, paypal);
    };
  }, []);

  const handleSubmit = async () => {
    if (await handleSignup()) {
      navigation("Success");
    }
  };

  const handleCheckCoupon = () => {
    if (coupon === "123") {
      setTotalPrice((prevState) => prevState / 2);
      setPriceDiscounted(true);
    }
  };

  useEffect(() => {
    setTotalPrice(0);
    childData.forEach((child) => {
      child.clubs.forEach((club) => {
        setTotalPrice((prevState) => prevState + 20); // Club Price
      });
    });
    setTotalPrice((prevState) => prevState + 35);
    handleCheckCoupon()
  }, [childData]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Payment</h1>
        <button onClick={() => navigation("ChildForm")}>Back</button>
      </div>
      <Alert variant="info">
        Faiful members of the church can receive 50% off. Please contact us at
        000-000-0000
      </Alert>
      <Form>
        <Form.Group>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter Cupon Here"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <InputGroup.Append>
              <Button onClick={handleCheckCoupon} variant="outline-success">
                Submit
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
      <ListGroup variant="flush">
        <ListGroup.Item variant="warning" className="font-weight-bold  pl-2">
          Children
        </ListGroup.Item>
        {childData.map((child, index) => (
          <>
            <ListGroup.Item variant="info" className="font-weight-bold  pl-4">
              {child.firstName} {child.lastName}
            </ListGroup.Item>
            {child.clubs.map((club: ClubProp) => (
              <ListGroup.Item
                className="bg-transparent d-inline-flex justify-content-between pl-5"
                key={club.id}
              >
                <div>{club.title}</div>
                <div>$20</div>
              </ListGroup.Item>
            ))}
          </>
        ))}
        <ListGroup.Item
          variant="warning"
          className="d-inline-flex justify-content-between font-weight-bold  pl-2"
        >
          <div>Registration Fee</div>
          <div>${process.env.NEXT_PUBLIC_REGISTRATION_FEE}</div>
        </ListGroup.Item>
        <ListGroup.Item
          variant="warning"
          className="d-inline-flex justify-content-between font-weight-bold  pl-2"
        >
          <div>Coupon</div>
          <div>{priceDiscounted ? "50%" : "-"}</div>
        </ListGroup.Item>
        <ListGroup.Item
          variant="warning"
          className="d-inline-flex justify-content-between font-weight-bold  pl-2"
        >
          <div>Total</div>
          <div>${totalPrice}</div>
        </ListGroup.Item>
      </ListGroup>

      <div className="mt-5">
        <div ref={paypal}></div>
      </div>
    </div>
  );
};

export default Payment;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const onRun = async (
  childData: ChildProp[],
  parentData: UserProp,
  onPaid: () => any,
  paypal: React.MutableRefObject<any>
) => {
  // Calculate Total Price
  let totalPrice = 0;
  childData.forEach((child) => {
    child.clubs.forEach((club) => {
      totalPrice += 20; // club.price
    });
  });

  // Format Items
  const itemsData = [];
  childData.forEach((child) => {
    child.clubs.forEach((club) => {
      itemsData.push({
        name: `${club.title} - ${child.firstName} ${child.lastName}`,
        unit_amount: {
          currency_code: "USD",
          value: String(20), // club.price
        },
        quantity: "1",
        sku: club.id,
        category: "DIGITAL_GOODS",
      });
    });
  });

  const paypalCreateOrderOptions: CreateOrderObj = {
    intent: "CAPTURE",
    payer: {
      name: {
        given_name: parentData.firstName,
        surname: parentData.lastName,
      },
      email_address: parentData.email,
    },
    purchase_units: [
      {
        amount: {
          value: (
            totalPrice + Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE)
          ).toFixed(2),
          currency_code: "USD",
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: (
                totalPrice + Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE)
              ).toFixed(2),
            },
          },
        },
        invoice_id: "1",
        items: [
          ...itemsData,
          {
            name: "Registration Fee",
            unit_amount: {
              currency_code: "USD",
              value: String(35),
            },
            quantity: "1",
            sku: "1",
            category: "DIGITAL_GOODS",
          },
        ],
      },
    ],
    application_context: {
      brand_name: "Always Active Academy",
    },
  };

  console.log(paypalCreateOrderOptions);

  (window as any).paypal
    .Buttons({
      createOrder: function (data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create(paypalCreateOrderOptions);
      },
      onApprove: function (data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function (details) {
          // Run stuff after successful payment
          onPaid();
          console.log(details);
        });
      },
      onError: function (error) {
        console.log(error);
      },
    })
    .render(paypal.current);
  console.log("Ran");
};
