import React, { useState } from "react";
import { Modal, Form, Alert } from "react-bootstrap";
import firebase from "../../utils/firebase";

interface Props {
  show: boolean;
  handleClose: () => void;
}

const AddUserModal: React.FC<Props> = (props) => {
  const { show, handleClose } = props;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"Student" | "Teacher" | string>("Student");

  const [error, setError] = useState(null);

  const createUser = async () => {
    try {
      const docRef = await firebase.firestore().collection("users").add({
        name,
        email,
        type,
      });
      await docRef.update({ id: docRef.id });
      handleClose()
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error ? <Alert variant="danger">{error}</Alert> : null}
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>User Type</Form.Label>
            <Form.Control
              as="select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Teacher</option>
              <option>Student</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={createUser}>Add User</button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddUserModal;
