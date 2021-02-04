import { AccountLayout } from "components/account";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Alert, Col, Form, InputGroup, Row } from "react-bootstrap";
import Select from "react-select";

import styles from "RegisterChild.module.scss";
import {
  ApiResProp,
  StudentProp,
  ParentProp,
  ClubProp,
} from "utils/interfaces";

import nookies from "nookies";
import firebaseAdmin from "utils/firebaseAdmin";

interface Props {
  data: ParentProp;
}

const RegisterChild: React.FC<Props> = (props) => {
  const { data } = props;
  const [error, setError] = useState(null);

  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [dobError, setDobError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clubs, setClubs] = useState([]);

  const [clubList, setClubList] = useState<ClubProp[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/clubs")
      .then((res) => res.json())
      .then((data: ApiResProp) => setClubList(data.data))
      .catch((error) => setError(error));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const studentJson = (await (
      await fetch("/api/users/students", {
        method: "POST",
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
          clubs,
        } as StudentProp),
      })
    ).json()) as ApiResProp;

    let childId = null;
    if (studentJson.status) {
      childId = studentJson.data.id;
    } else {
      setError(studentJson.error);
      return;
    }

    const parentJson = (await (
      await fetch(`/api/users/parents/${data.id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          childId,
          action: "add",
        }),
      })
    ).json()) as ApiResProp;

    if (parentJson.status) {
      router.push("/account/children");
    } else {
      setError(parentJson.error);
      return;
    }
  };

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
        <Form.Group>
          <Form.Label>Clubs</Form.Label>
          <Select
            value={
              clubList.length &&
              clubs.map((selectedClub) => ({
                value: selectedClub,
                label: clubList.filter((item) => item.id === selectedClub)[0]
                  .title,
              }))
            }
            options={clubList.map((club) => ({
              value: club.id,
              label: club.title,
            }))}
            isMulti
            onChange={(e) => {
              setClubs(e ? e.map((item) => item.value) : []);
            }}
          />
        </Form.Group>
        <button type="submit">Register</button>
      </Form>
    </AccountLayout>
  );
};

export default RegisterChild;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);

  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const jsonData = (await (
      await fetch(`${process.env.SERVER}/api/users/parents/${uid}`)
    ).json()) as ApiResProp;
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
