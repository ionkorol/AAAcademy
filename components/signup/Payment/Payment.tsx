import { faDivide } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, ListGroup, Alert } from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";
import { ChildProp, ClubProp, UserProp } from "utils/interfaces";
import { GetOrderObj } from "./functions";

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
  const [orderObj, setOrderObj] = useState(null);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paypal = useRef(null);

  const handleOrderObj = async () => {
    setOrderObj(await GetOrderObj(childData, parentData, coupon));
  };

  useEffect(() => {
    handleOrderObj();
  }, [childData, parentData, coupon]);

  console.log(orderObj);

  // Render Paypal Buttons
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_API_KEY}`;
    //For head
    document.head.appendChild(script);
  }, [childData, parentData]);

  // Handle Payment Form Submit
  const handleSubmit = async () => {
    if (await handleSignup()) {
      navigation("Success");
    }
  };

  const handleCheckCoupon = () => {
    if (coupon === "123") {
      setTotalPrice((prevState) => prevState / 2);
      setPriceDiscounted(true);
      // onRun(childData, parentData, coupon, handleSubmit, paypal);
    }
  };

  // Calculate Total Price
  const handleTotalPrice = () => {
    setTotalPrice(0);
    childData.forEach((child) => {
      child.clubs.forEach((club) => {
        if (coupon === "123") {
          setTotalPrice((prevState) => prevState + club.price / 2);
        } else {
          setTotalPrice((prevState) => prevState + club.price); // Club Price
        }
      });
    });
    setTotalPrice(
      (prevState) =>
        prevState + Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE)
    );
  };

  useEffect(() => {
    handleTotalPrice();
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
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleTotalPrice();
          console.log("Test");
          // onRun(childData, parentData, coupon, handleSubmit, paypal);
        }}
      >
        <Form.Group>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter Cupon Here"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <InputGroup.Append>
              <Button type="submit" variant="outline-success">
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
          <React.Fragment key={index}>
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
          </React.Fragment>
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
        <PayPalButton
          amount={totalPrice}
          // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
          createOrder={(data, actions) => {
            return actions.order.create(orderObj);
          }}
          onSuccess={async (details, data) => {
            alert("Transaction completed by " + details.payer.name.given_name);

            const res = await fetch("/api/users", {
              method: "POST",
              body: JSON.stringify(parentData),
            });
            const jsonData = await res.json();

            // OPTIONAL: Call your server to save the transaction
            return fetch("/api/orders", {
              method: "POST",
              body: JSON.stringify({
                userId: jsonData.data,
                totalPrice: totalPrice,
                children: childData,
              }),
            });
          }}
        />
      </div>
    </div>
  );
};

export default Payment;
