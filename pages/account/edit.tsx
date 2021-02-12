import { AccountLayout } from "components/account";
import React, { useState } from "react";
import { Alert, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import nookies from "nookies";
import { ApiResProp, ParentProp } from "utils/interfaces";
import firebaseAdmin from "utils/firebaseAdmin";
import { GetServerSideProps } from "next";
import states from "utils/states.json";
import { useRouter } from "next/router";
import { route } from "next/dist/next-server/server/router";

interface Props {
  data: ParentProp;
}

const EditAccount: React.FC<Props> = (props) => {
  const { data } = props;
  const [error, setError] = useState(null);

  const [firstName, setFirstName] = useState(data.firstName);
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastName, setLastName] = useState(data.lastName);
  const [lastNameError, setLastNameError] = useState(null);
  const [email, setEmail] = useState(data.email);
  const [emailError, setEmailError] = useState(null);
  const [phone, setPhone] = useState(data.phone);
  const [phoneError, setPhoneError] = useState(null);

  const [eName, setEName] = useState(data.emergencyContact.name);
  const [eNameError, setENameError] = useState(null);
  const [ePhone, setEPhone] = useState(data.emergencyContact.phone);
  const [ePhoneError, setEPhoneError] = useState(null);

  const [address1, setAddress1] = useState(data.address.addressLine1);
  const [address1Error, setAddress1Error] = useState(null);
  const [address2, setAddress2] = useState(data.address.addressLine2);
  const [address2Error, setAddress2Error] = useState(null);
  const [city, setCity] = useState(data.address.city);
  const [cityError, setCityError] = useState(null);
  const [state, setState] = useState(data.address.state);
  const [stateError, setStateError] = useState(null);
  const [postalCode, setPostalCode] = useState(data.address.postalCode);
  const [postalCodeError, setPostalCodeError] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`/api/users/parents/${data.id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        emergencyContact: {
          name: eName,
          phone: ePhone,
        },
        address: {
          addressLine1: address1,
          addressLine2: address2,
          city,
          state,
          postalCode,
        },
      } as ParentProp),
    });
    const jsonData = (await res.json()) as ApiResProp;
    if (jsonData.status) {
      router.back();
    } else {
      setError(jsonData.error);
    }
  };

  return (
    <AccountLayout>
      <Container>
        {error ? <Alert variant="danger">{error}</Alert> : null}
        <Form id="currentForm" onSubmit={handleSubmit}>
          <h4>Personal Info</h4>
          <hr></hr>
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
                  {lastNameError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
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
            <Form.Label>Phone Number</Form.Label>
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
          <h4>Emergency Info</h4>
          <hr></hr>
          <Form.Group>
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={eName}
              onChange={(e) => setEName(e.target.value)}
              isInvalid={!!eNameError}
              required
            />
            <Form.Control.Feedback type="invalid">
              {eNameError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>+1</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="tel"
                value={ePhone}
                onChange={(e) => setEPhone(e.target.value)}
                isInvalid={!!ePhoneError}
                required
              />
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {ePhoneError}
            </Form.Control.Feedback>
          </Form.Group>
          <h4>Address Info</h4>
          <hr></hr>
          <Form.Group>
            <Form.Label>Address 1</Form.Label>
            <Form.Control
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              isInvalid={!!address1Error}
              required
            />
            <Form.Control.Feedback type="invalid">
              {address1Error}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Address 2 (Optional)</Form.Label>
            <Form.Control
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              isInvalid={!!address2Error}
            />
            <Form.Control.Feedback type="invalid">
              {address2Error}
            </Form.Control.Feedback>
          </Form.Group>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  isInvalid={!!cityError}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {cityError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Control
                  as="select"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  {states.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  isInvalid={!!postalCodeError}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {postalCodeError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <button type="submit">Register</button>
        </Form>
      </Container>
    </AccountLayout>
  );
};

export default EditAccount;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const res = await fetch(`${process.env.SERVER}/api/users/parents/${uid}`);
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
