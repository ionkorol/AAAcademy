import React, { useEffect, useState } from "react";
import { Modal, Form, Alert } from "react-bootstrap";
import firebase from "../../utils/firebase";
import { UserProp } from "../../utils/interfaces";

interface Props {
  userData: UserProp;
  show: boolean;
  handleClose: () => void;
}

const EditUserModal: React.FC<Props> = (props) => {
  const { show, handleClose, userData } = props;
  console.log(userData);
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [type, setType] = useState<"Student" | "Teacher" | string>(
    userData.type
  );

  const [error, setError] = useState(null);

  useEffect(() => {
    setName(userData.name);
    setEmail(userData.email)
    setType(userData.type)
  }, [userData]);

  const editUser = async () => {
    try {
      await firebase.firestore().collection("users").doc(userData.id).set(
        {
          name,
          email,
          type,
        },
        { merge: true }
      );
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
        <button onClick={editUser}>Save Changes</button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUserModal;
