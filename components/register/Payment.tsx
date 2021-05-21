import { useRegistrationData } from "hooks/useRegistrationData";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Table } from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";
import Image from "next/image";

import styles from "./Payment.module.scss";
import { useRouter } from "next/router";

interface Props {
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const Payment: React.FC<Props> = (props) => {
  const { setActiveTab } = props;
  const registrationData = useRegistrationData();
  const { childrenData } = registrationData;

  const router = useRouter();

  const calculateAmout = () => {
    switch (childrenData.length) {
      case 1:
        return 200;
      case 2:
        return 350;

      default:
        return 350 + (childrenData.length - 2) * 100;
    }
  };

  const handlePrevious = () => {
    setActiveTab("Terms");
  };

  const handleOnPaymentSuccess = async (
    paymentId: string,
    paymentEmail: string
  ) => {
    try {
      const res = await fetch("/api/summer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...registrationData.parentData,
          children: registrationData.childrenData,
          medicalCondition: registrationData.medicalCondition,
          emergencyContant: registrationData.emergencyContact,
          payment: {
            receiptId: paymentId,
            amount: calculateAmout(),
            email: paymentEmail,
          },
        }),
      });
      router.push("/summer/thankyou");
    } catch (error) {
      alert("Something Went Wrong!");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.cardContainer}>
        <Table>
          <thead>
            <tr>
              <th>Child</th>
              <th style={{ textAlign: "right" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {childrenData.map((item, index) => (
              <tr key={item.id}>
                <td>
                  {item.firstName} {item.lastName}
                </td>
                <td style={{ textAlign: "right" }}>
                  {index === 0
                    ? "$200.00"
                    : index === 1
                    ? "$150.00"
                    : "$100.00"}
                </td>
              </tr>
            ))}
            <tr>
              <td>Children: {childrenData.length}</td>
              <td style={{ textAlign: "right" }}>
                Total: <b>${calculateAmout().toFixed(2)}</b>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div className={styles.payContainer}>
        <div className={styles.payButton}>
          <PayPalButton
            amount={calculateAmout()}
            onSuccess={(details, data) => {
              handleOnPaymentSuccess(details.id, details.payer.email_address);
              console.log(details, data);
            }}
            options={{
              clientId: process.env.NEXT_PUBLIC_PAYPAL_API_KEY,
              disableFunding: "credit",
            }}
            style={{ layout: "vertical", tagline: false, label: "pay" }}
          />
        </div>
        <p>
          <b>100% Secured Payment</b>
        </p>
        <p>
          Transactions Your information is guaranteed to be safe and secure!
        </p>
        <div className={styles.acceptedPayments}>
          <div>
            <Image src="/cards/visa.svg" width={50} height={50} />
          </div>
          <div>
            <Image src="/cards/mastercard.svg" width={50} height={50} />
          </div>
          <div>
            <Image src="/cards/discover.svg" width={50} height={50} />
          </div>
          <div>
            <Image src="/cards/amex.svg" width={50} height={50} />
          </div>
          <div>
            <Image src="/cards/paypal.svg" width={50} height={50} />
          </div>
          <div>
            <Image src="/cards/diners.svg" width={50} height={50} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button type="button" onClick={handlePrevious}>
          Previous
        </button>
      </div>
    </div>
  );
};

export default Payment;
