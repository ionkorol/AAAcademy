import React, { useState } from "react";
import { Layout } from "components/common";

import styles from "./SignIn.module.scss";
import { Form, InputGroup } from "react-bootstrap";
import { UserProp } from "utils/interfaces";
import useAuth from "hooks/useAuth";

interface Props {}

const SignIn: React.FC<Props> = (props) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);

  const auth = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    auth.signIn(email, password);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.slider}>
          <h1>Sign In</h1>
        </div>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>lOG IN</h1>
          <Form id="currentForm" onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!emailError}
                required
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!passwordError}
                required
              />
              <Form.Control.Feedback type="invalid">
                {passwordError}
              </Form.Control.Feedback>
            </Form.Group>
            <button type="submit">Log In</button>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default SignIn;
