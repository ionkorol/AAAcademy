import { ChildForm, ParentForm, Success } from "components/signup";
import React, { useEffect, useState } from "react";
import firebaseClient from "utils/firebaseClient";
import { UserProp } from "utils/interfaces";
import { Layout } from "../../components/common";

import styles from "./SignUp.module.scss";

interface Props {}

const SignUp: React.FC<Props> = (props) => {
  const [page, setPage] = useState<"ParentForm" | "ChildForm" | "Success">(
    "ParentForm"
  );

  const [parent, setParent] = useState<UserProp>(null);
  const [children, setChildren] = useState({});

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
    <Layout>
      <div className={styles.container}>
        <div className={styles.slider}>
          <h1>Sign Up</h1>
        </div>
        {page === "ParentForm" ? (
          <ParentForm navigation={setPage} handleData={setParent} />
        ) : page === "ChildForm" ? (
          <ChildForm
            navigation={setPage}
            handleData={setChildren}
            handleSignup={handleSubmit}
          />
        ) : page === "Success" ? (
          <Success />
        ) : null}
        <button
          form="currentForm"
          type="submit"
          className={styles.nextButton}
          style={page === "Success" ? { display: "none" } : null}
        >
          Next
        </button>
      </div>
    </Layout>
  );
};

export default SignUp;
