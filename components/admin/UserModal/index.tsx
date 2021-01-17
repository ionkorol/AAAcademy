import React, { useEffect, useState } from "react";
import { Modal, Form, Alert, Col, Row } from "react-bootstrap";
import { UserProp } from "utils/interfaces";

interface Props {
  userData: UserProp;
  show: boolean;
  handleClose: () => void;
  onRun: (userData: UserProp) => void;
  error: string;
  action: "edit" | "add";
}

const UserModal: React.FC<Props> = (props) => {
  const { show, handleClose, userData, onRun, error, action } = props;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"Student" | "Teacher" | string>("");

  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    email: null,
    type: null,
    phone: null,
  });

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
      setEmail(userData.email);
      setPhone(userData.phone);
      setType(userData.type);
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setType("");
    }
    setErrors({
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      type: null,
    });
  }, [userData, show]);

  const formValidation = async () => {
    // First Name Validation
    // Empty
    if (!firstName) {
      setErrors((prevState) => ({
        ...prevState,
        firstName: "Name has not been set!",
      }));
      return false;
    }
    // Last Name Validation
    // Empty
    if (!lastName) {
      setErrors((prevState) => ({
        ...prevState,
        lastName: "Name has not been set!",
      }));
      return false;
    }

    // Email Validation
    // Empty
    if (!email) {
      setErrors((prevState) => ({
        ...prevState,
        email: "Email has not been set!",
      }));
      return false;
    }

    // Phone Validation
    // Empty
    if (!phone) {
      setErrors((prevState) => ({
        ...prevState,
        phone: "Phone has not been set!",
      }));
      return false;
    }

    // Type Validation
    // Empty
    if (!type) {
      setErrors((prevState) => ({
        ...prevState,
        type: "Type has not been set!",
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const test = await formValidation();
    if (test) {
      onRun({
        firstName,
        lastName,
        email,
        type,
        phone,
        id: userData ? userData.id : null,
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error ? <Alert variant="danger">{error}</Alert> : null}
        <Form id="user-form" onSubmit={handleSubmit} noValidate>
          <Col>
            <Row>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Col>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>User Type</Form.Label>
            <Form.Control
              as="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              isInvalid={!!errors.type}
            >
              <option>Choose Type</option>
              <option>Teacher</option>
              <option>Student</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.type}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button type="submit" form="user-form">
          Save Changes
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserModal;
