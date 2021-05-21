import { useRegistrationData } from "hooks/useRegistrationData";
import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Modal, Button, Form, Col, ListGroup, Table } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

interface Props {
  setActiveTab: Dispatch<SetStateAction<string>>;
}

const ChildInfo: React.FC<Props> = (props) => {
  const { setActiveTab } = props;
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDOB] = useState("");
  const [grade, setGrade] = useState("1");

  const registrationData = useRegistrationData();

  const handleShow = () => setShow(true);
  const handleClose = () => {
    resetData();
    setShow(false);
  };

  const handleAddChild = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Ran");
    registrationData.addChild({
      id: uuidv4(),
      firstName,
      lastName,
      dob,
      grade,
    });
    resetData();
    setShow(false);
  };

  const resetData = () => {
    setFirstName("");
    setLastName("");
    setDOB("");
    setGrade("1");
  };

  const handleNext = () => {
    if (!registrationData.childrenData.length) {
      alert("Please add at least one child.");
      return;
    }
    setActiveTab("ParentInfo");
  };

  return (
    <div>
      <button
        style={{ marginTop: "10px", marginBottom: "10px" }}
        type="button"
        onClick={handleShow}
      >
        Add Child
      </button>
      <Table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>DOB</th>
            <th>Grade</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!registrationData.childrenData.length && (
            <tr>
              <td colSpan={5}>No Children</td>
            </tr>
          )}
          {registrationData.childrenData.map((item) => (
            <tr key={item.id}>
              <td>{item.firstName}</td>
              <td>{item.lastName}</td>
              <td>{item.dob}</td>
              <td>{item.grade}</td>
              <td>
                <Button
                  onClick={() => registrationData.removeChild(item.id)}
                  variant="outline-danger"
                >
                  X
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button type="button" onClick={handleNext}>
          Next
        </button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form id="addChildForm" onSubmit={handleAddChild}>
            <Form.Row>
              <Col>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col>
                <Form.Group>
                  <Form.Label>Date Of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={dob}
                    onChange={(e) => setDOB(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Grade Attending In The Fall</Form.Label>
                  <Form.Control
                    as="select"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" form="addChildForm">
            Add Child
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChildInfo;
