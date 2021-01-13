import React, { useState } from "react";
import { Form, FormText } from "react-bootstrap";
import { Layout } from "../../components/common";

import styles from "./SignUp.module.scss";

interface Props {}

const SignUp: React.FC<Props> = (props) => {
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(null);
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.slider}>
          <img src="slide/img1.jpg" alt="text" />
          <div className={styles.content}>
            <h1>Sign Up</h1>
          </div>
          <div className={styles.form}>
            <Form>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  isInvalid={!!firstNameError}
                  required
                />
                <Form.Control.Feedback type="invalid">{firstNameError}</Form.Control.Feedback>>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
