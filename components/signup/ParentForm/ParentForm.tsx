import React, { useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { UserProp } from "utils/interfaces";

import styles from "./ParentForm.module.scss";

interface Props {
  navigation: React.Dispatch<any>;
  handleData: React.Dispatch<any>;
  data: UserProp;
}

const ParentForm: React.FC<Props> = (props) => {
  const { navigation, handleData, data } = props;

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
  const [adminArea, setAdminArea] = useState(data.address.adminArea);
  const [adminAreaError, setAdminAreaError] = useState(null);
  const [postalCode, setPostalCode] = useState(data.address.postalCode);
  const [postalCodeError, setPostalCodeError] = useState(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleData({
      firstName,
      lastName,
      email,
      phone,
      type: "Parent",
      emergencyContact: {
        name: eName,
        phone: ePhone,
      },
      address: {
        addressLine1: address1,
        addressLine2: address2,
        adminArea,
        postalCode,
      },
    } as UserProp);
    navigation("ChildForm");
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Parent Information</h1>
      </div>
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
                value={adminArea}
                onChange={(e) => setAdminArea(e.target.value)}
                isInvalid={!!adminAreaError}
                required
              />
              <Form.Control.Feedback type="invalid">
                {adminAreaError}
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
        <button type="submit">Next</button>
      </Form>
    </div>
  );
};

export default ParentForm;
