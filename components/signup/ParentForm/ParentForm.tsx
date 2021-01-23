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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleData({
      firstName,
      lastName,
      email,
      phone,
      type: "Parent",
    } as UserProp);
    navigation("ChildForm");
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Parent Information</h1>
      </div>
      <Form id="currentForm" onSubmit={handleSubmit}>
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
              type="number"
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
        <button type="submit">Next</button>
      </Form>
    </div>
  );
};

export default ParentForm;
