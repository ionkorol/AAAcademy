import { AccountLayout } from "components/account";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Alert, Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import firebaseAdmin from "utils/firebaseAdmin";
import { ApiResProp, StudentProp } from "utils/interfaces";
import nookies from "nookies";

interface Props {
  data: StudentProp;
  parentId: string;
}

const EditChild: React.FC<Props> = (props) => {
  const { data, parentId } = props;
  const [error, setError] = useState(null);

  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [dobError, setDobError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);

  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [dob, setDob] = useState(data.dob);
  const [email, setEmail] = useState(data.email);
  const [phone, setPhone] = useState(data.phone);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonData = (await (
      await fetch(`/api/parents/${parentId}/students/${router.query.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          dob,
          email,
          phone,
        } as StudentProp),
      })
    ).json()) as ApiResProp;

    if (jsonData.status) {
      router.back();
    } else {
      setError(jsonData.error);
      return;
    }
  };

  console.log(data);

  return (
    <AccountLayout>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                isInvalid={!!firstNameError}
                required
              />
              <Form.Control.Feedback type="invalid">
                {firstNameError}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                isInvalid={!!lastNameError}
                required
              />
              <Form.Control.Feedback type="invalid">
                {!!lastNameError}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group>
          <Form.Label>Date of Birth</Form.Label>
          <Form.Control
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            isInvalid={!!dobError}
            required
          />
          <Form.Control.Feedback type="invalid">
            {dobError}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>+1</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              isInvalid={!!phoneError}
              required
            />
          </InputGroup>
          <Form.Control.Feedback type="invalid">
            {phoneError}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Email (Optional)</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Form.Control.Feedback type="invalid">
            {emailError}
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" variant="warning">
          Save
        </Button>
      </Form>
    </AccountLayout>
  );
};

export default EditChild;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  const { id } = ctx.query;
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const jsonData = (await (
      await fetch(`${process.env.SERVER}/api/parents/${uid}/students/${id}`)
    ).json()) as ApiResProp;
    if (jsonData.status) {
      return {
        props: {
          data: jsonData.data,
          parentId: uid,
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
