import useAuth from "hooks/useAuth";
import React, { useState } from "react";
import { Alert, Col, Form, InputGroup, Row } from "react-bootstrap";
import { ApiResProp, ParentProp } from "utils/interfaces";
import { daysNames, monthsNames } from "utils/variables";
import { Layout } from "../../components/common";

import styles from "./SignUp.module.scss";

interface Props {}

const SignUp: React.FC<Props> = (props) => {
  const [error, setError] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(null);

  const [eName, setEName] = useState("");
  const [eNameError, setENameError] = useState(null);
  const [ePhone, setEPhone] = useState("");
  const [ePhoneError, setEPhoneError] = useState(null);

  const [address1, setAddress1] = useState("");
  const [address1Error, setAddress1Error] = useState(null);
  const [address2, setAddress2] = useState("");
  const [address2Error, setAddress2Error] = useState(null);
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState(null);
  const [state, setState] = useState("");
  const [stateError, setStateError] = useState(null);
  const [postalCode, setPostalCode] = useState("");
  const [postalCodeError, setPostalCodeError] = useState(null);

  const [tosAgree, setTOSAgree] = useState(false);
  const [covidAgree, setCovidAgree] = useState(false);

  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentDate = new Date()
    const res = await fetch("/api/parents", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        createdAt: {
          day: currentDate.getDate(),
          dayName: daysNames[currentDate.getDay()],
          month: currentDate.getMonth(),
          monthName: monthsNames[currentDate.getMonth()],
          year: currentDate.getFullYear()
        },
        emergencyContact: {
          name: eName,
          phone: ePhone,
        },
        address: {
          addressLine1: address1,
          addressLine2: address2,
          state,
          city,
          postalCode,
        },
        password,
        hasDiscount: false,
        paidRegistration: false,
        funds: {
          amount: 0,
        },
      } as ParentProp),
    });
    const jsonData = (await res.json()) as ApiResProp;
    if (jsonData.status) {
      const { email } = jsonData.data;
      auth.signIn(email, password);
    } else {
      setError(jsonData.error);
    }
  };

  return (
    <Layout title="Sign Up for Clubs">
      <div className={styles.container}>
        <div className={styles.slider}>
          <h1>Sign Up</h1>
        </div>
        <div className={styles.formContainer}>
          <div className={styles.title}>
            <h1>Registration</h1>
          </div>
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
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    isInvalid={!!stateError}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {stateError}
                  </Form.Control.Feedback>
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
            <Form.Group>
              <Form.Label>
                <a
                  href="/policy/tos"
                  target="_blank"
                  rel="norefer"
                  className="text-danger"
                >
                  Read Terms of Service
                </a>
              </Form.Label>
              <Form.Check
                type="checkbox"
                label="I aggree to the Terms of Services"
                checked={tosAgree}
                onChange={(e) => setTOSAgree(!tosAgree)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                <a
                  href="/policy/covid-release"
                  target="_blank"
                  rel="norefer"
                  className="text-danger"
                >
                  Read Covid Release Form
                </a>
              </Form.Label>
              <Form.Check
                type="checkbox"
                label="I aggree to the Covid Release Form"
                checked={covidAgree}
                onChange={(e) => setCovidAgree(!covidAgree)}
                required
              />
            </Form.Group>
            <button type="submit">Register</button>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default SignUp;
