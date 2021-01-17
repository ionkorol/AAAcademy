import React, { useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { UserProp } from "utils/interfaces";

import styles from "./ParentForm.module.scss";

interface Props {
  navigation: React.Dispatch<any>;
  handleData: React.Dispatch<any>;
}

const ParentForm: React.FC<Props> = (props) => {
  const { navigation, handleData } = props;

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [phone, setPhone] = useState("");
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
      <h1 className={styles.title}>Parent Info</h1>
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
      </Form>
    </div>
  );
};

export default ParentForm;
