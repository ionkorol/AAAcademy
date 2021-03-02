import React, { useState } from "react";
import { AccountLayout } from "components/account";

import styles from "./Account.module.scss";
import { GetServerSideProps } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";
import { ParentProp } from "utils/interfaces";
import { Button, Container, Form, Row } from "react-bootstrap";
import Link from "next/link";
import firebaseClient from "utils/firebaseClient";
import useAuth from "hooks/useAuth";

interface Props {
  data: ParentProp;
  error: any;
}

const Account: React.FC<Props> = (props) => {
  const { data, error } = props;

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [cPassword, setCPassword] = useState("");
  const [cPasswordError, setCPasswordError] = useState(null);

  const auth = useAuth();

  const formValidation = () => {
    setPasswordError(null);
    setCPasswordError(null);

    if (password.length < 6) {
      setPasswordError("Password is shorter then 6 characters");
    }
    if (cPassword !== password) {
      setCPasswordError("Confirmation password is not the same");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formValidation();
    if (!passwordError && !cPasswordError) {
      auth.signIn(data.email, "moldfex03");
      firebaseClient
        .auth()
        .currentUser.updatePassword(password)
        .then(() => {
          alert("Success");
          auth.signOut();
        })
        .catch((error) => alert(error));
    }
  };

  return (
    <AccountLayout>
      <Container>
        <Container className={styles.card}>
          <h2>Personal Info</h2>
          <hr></hr>
          <div className={styles.body}>
            <div className="font-weight-bold">Name:</div>
            <div>
              {data.firstName} {data.lastName}
            </div>

            <div className="font-weight-bold">Email:</div>
            <div>{data.email}</div>

            <div className="font-weight-bold">Phone:</div>
            <div>{data.phone}</div>

            <div className="font-weight-bold">Address:</div>
            <div>
              <p>{data.address.addressLine1}</p>
              <p>{data.address.addressLine2}</p>
              <p>
                {data.address.city} {data.address.state}{" "}
                {data.address.postalCode}
              </p>
            </div>
          </div>
          <Link href="/account/edit">
            <button className="w-100">Edit</button>
          </Link>
          <h2 className="mt-5">Change Password</h2>
          <hr></hr>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
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
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={cPassword}
                onChange={(e) => setCPassword(e.target.value)}
                isInvalid={!!cPasswordError}
                required
              />
              <Form.Control.Feedback type="invalid">
                {cPasswordError}
              </Form.Control.Feedback>
            </Form.Group>
            <button type="submit" className="w-100">
              Submit
            </button>
          </Form>
        </Container>
      </Container>
    </AccountLayout>
  );
};

export default Account;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const res = await fetch(`${process.env.SERVER}/api/parents/${uid}`);
    const jsonData = await res.json();
    if (jsonData.status) {
      return {
        props: {
          data: jsonData.data,
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
