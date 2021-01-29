import { ChildForm, ParentForm, Payment, Success } from "components/signup";
import React, { useEffect, useState } from "react";
import firebaseClient from "utils/firebaseClient";
import { ChildProp, UserProp } from "utils/interfaces";
import { Layout } from "../../components/common";

import styles from "./SignUp.module.scss";

interface Props {}

const SignUp: React.FC<Props> = (props) => {
  const [page, setPage] = useState<
    "ParentForm" | "ChildForm" | "Payment" | "Success"
  >("ParentForm");

  const [parent, setParent] = useState<UserProp>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    type: "Parent",
    address: {
      addressLine1: "",
      addressLine2: "",
      adminArea: "",
      postalCode: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
    },
    children: [],
  });
  const [children, setChildren] = useState<ChildProp[]>([]);

  const handleSubmit = async () => {
    try {
      // Register Parent
      const parentRes = await fetch("/api/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parent),
      });

      const parentJson = await parentRes.json();
      const parentId = parentJson.data.id;

      // Register Children
      children.forEach(async (child) => {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(child),
        });
        const jsonData = await res.json();
        const childId = jsonData.data.id;

        // Update Parent Children Array
        await fetch(`/api/users/${parentId}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            childId,
          }),
        });
      });

      // Create Order
      await fetch("/api/orders", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent: parentJson.data,
          totalPrice: process.env.NEXT_PUBLIC_REGISTRATION_FEE,
          children: children,
        }),
      });

      return true;
    } catch (error) {
      alert(error);
      return false;
    }
  };

  return (
    <Layout title="Sign Up for Clubs">
      <div className={styles.container}>
        <div className={styles.slider}>
          <h1>Sign Up</h1>
        </div>
        {page === "ParentForm" ? (
          <ParentForm
            navigation={setPage}
            handleData={setParent}
            data={parent}
          />
        ) : page === "ChildForm" ? (
          <ChildForm
            navigation={setPage}
            handleData={setChildren}
            parentData={parent}
            data={children}
          />
        ) : page === "Payment" ? (
          <Payment
            navigation={setPage}
            parentData={parent}
            childData={children}
            handleSignup={handleSubmit}
          />
        ) : page === "Success" ? (
          <Success />
        ) : null}
      </div>
    </Layout>
  );
};

export default SignUp;
