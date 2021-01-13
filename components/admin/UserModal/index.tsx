import React, { useEffect, useState } from "react";
import { Modal, Form, Alert } from "react-bootstrap";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"Student" | "Teacher" | string>("");

  const [errors, setErrors] = useState({
    name: null,
    email: null,
    type: null,
  });

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setEmail(userData.email);
      setType(userData.type);
    } else {
      setName("");
      setEmail("");
      setType("");
    }
    setErrors({
      name: null,
      email: null,
      type: null,
    });
  }, [userData, show]);

  const formValidation = async () => {
    // Title Validation
    // Empty
    if (!name) {
      setErrors((prevState) => ({
        ...prevState,
        name: "Name has not been set!",
      }));
      return false;
    }

    // Categories Validation
    // Empty
    if (!email) {
      setErrors((prevState) => ({
        ...prevState,
        email: "Email has not been set!",
      }));
      return false;
    }

    // Date Validation
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
        name,
        email,
        type,
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
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
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
