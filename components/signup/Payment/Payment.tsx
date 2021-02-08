import React, { useEffect, useState } from "react";
import { ListGroup, Alert, Form } from "react-bootstrap";
import firebaseClient from "utils/firebaseClient";
import { ChildProp, ClubProp, UserProp } from "utils/interfaces";
import { CreateOrderObj } from "./interfaces";

import styles from "./Payment.module.scss";
import TOSModal from "./TOSModal";

interface Props {
  handleSignup: () => Promise<boolean>;
  navigation: React.Dispatch<any>;
  childData: ChildProp[];
  parentData: UserProp;
}

const Payment: React.FC<Props> = (props) => {
  const { handleSignup, navigation, childData, parentData } = props;

  const [totalPrice, setTotalPrice] = useState(
    Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE)
  );
  const [orderObj, setOrderObj] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [tries, setTries] = useState(0);

  const [tosAgree, setTOSAgree] = useState(false);
  const [covidAgree, setCovidAgree] = useState(false);

  const [showTOSModal, setShowTOSModal] = useState(false);
  const [showCovidModal, setShowCovidModal] = useState(false);

  const handleOrderObj = async () => {
    // Calculate Invoice Number
    const invoiceId =
      Number(
        (
          await firebaseClient
            .firestore()
            .collection("orders")
            .orderBy("id", "asc")
            .limitToLast(1)
            .get()
        ).docs[0].id
      ) + 1;

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
            value: process.env.NEXT_PUBLIC_REGISTRATION_FEE,
            currency_code: "USD",
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: process.env.NEXT_PUBLIC_REGISTRATION_FEE,
              },
            },
          },
          invoice_id: String(invoiceId),
          items: [
            {
              name: "Registration Fee",
              unit_amount: {
                currency_code: "USD",
                value: String(process.env.NEXT_PUBLIC_REGISTRATION_FEE),
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
    setOrderObj(paypalCreateOrderOptions);
  };

  // Handle Payment Form Submit
  const handleSubmit = () => {
    handleSignup().then((value) => value && navigation("Success"));
  };

  useEffect(() => {
    handleOrderObj();
  }, [parentData, childData, tries]);

  console.log(orderObj);

  return (
    <div className={styles.container}>
      <TOSModal
        show={showTOSModal}
        handleClose={() => setShowTOSModal(!showTOSModal)}
      />
      <div className={styles.title}>
        <h1>Confirmation</h1>
        <button onClick={() => navigation("ChildForm")}>Back</button>
      </div>
      <Alert variant="info" className="text-center">
        For available discounts and scholarship please reach out to us at
        <br></br>
        404-641-0798!
      </Alert>
      {error ? <Alert variant="danger">{JSON.stringify(error)}</Alert> : null}
      <ListGroup>
        {childData.map((child, index) => (
          <React.Fragment key={index}>
            <ListGroup.Item
              variant="warning"
              className="font-weight-bold  pl-4"
            >
              {child.firstName} {child.lastName}
            </ListGroup.Item>
            {child.clubs.map((club: ClubProp) => (
              <ListGroup.Item
                className="d-inline-flex justify-content-between pl-5"
                variant="info"
                key={club.id}
              >
                <div>{club.title}</div>
                <div>${club.price.toFixed(2)} / class</div>
              </ListGroup.Item>
            ))}
          </React.Fragment>
        ))}
      </ListGroup>
      <div className={styles.agree}>
        
      </div>

      <div className="mt-5">
        <button
          disabled={covidAgree && tosAgree ? false : true}
          className={styles.payOnSite}
          type="button"
          onClick={handleSubmit}
        >
          Register
        </button>
        {/* {covidAgree && tosAgree ? (
          <PayPalButton
            style={{}}
            amount={totalPrice}
            createOrder={(data, actions) => {
              return actions.order.create(orderObj);
            }}
            onError={(err) => {
              setTries((prevState) => prevState + 1);
              setError(
                "There was an issue with your payment please try again!"
              );
            }}
            catchError={(err) => {
              setTries((prevState) => prevState + 1);
              setError(
                "There was an issue with your payment please try again!"
              );
            }}
            onSuccess={async (details, data) => {
              setError(null);
              // OPTIONAL: Call your server to save the transaction
              handleSubmit();
            }}
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_API_KEY,
              currency: "USD",
              disableFunding: "credit",
            }}
          />
        ) : (
          <>
            <button className={styles.payOnSite} disabled>
              Paypal
            </button>
            <button className={styles.payOnSite} disabled>
              Credit Card
            </button>
          </>
        )} */}
      </div>
    </div>
  );
};

export default Payment;
