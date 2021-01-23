import { ChildForm, ParentForm, Payment, Success } from "components/signup";
import React, { useEffect, useState } from "react";
import firebaseClient from "utils/firebaseClient";
import { UserProp } from "utils/interfaces";
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
  });
  const [children, setChildren] = useState([]);

  useEffect(() => {
    console.log(parent, children);
  }, []);

  const handleSubmit = async () => {
    try {
      const childrenIds = [];
      Object.keys(children).map(async (childIndex) => {
        const ref = await firebaseClient
          .firestore()
          .collection("users")
          .add({ ...children[childIndex] });
        childrenIds.push(ref.id);
      });
      await firebaseClient
        .firestore()
        .collection("users")
        .add({ ...parent, children: childrenIds } as UserProp);

      return true;
    } catch (error) {
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
          <ParentForm navigation={setPage} handleData={setParent} data={parent} />
        ) : page === "ChildForm" ? (
          <ChildForm navigation={setPage} handleData={setChildren} data={children} />
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
