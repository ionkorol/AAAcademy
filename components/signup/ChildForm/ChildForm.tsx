import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import firebaseClient from "utils/firebaseClient";
import { ClubProp, UserProp } from "utils/interfaces";
import Select from "react-select";

import styles from "./ChildForm.module.scss";

interface Props {
  navigation: React.Dispatch<any>;
  handleData: React.Dispatch<any>;
  handleSignup: () => Promise<boolean>;
}

const ChildForm: React.FC<Props> = (props) => {
  const { navigation, handleData, handleSignup } = props;

  const [children, setChildren] = useState({
    1: {
      firstName: "",
      lastName: "",
      dob: "",
    },
  });
  const [childrenNumber, setChildrenNumber] = useState(1);

  const handleAddChild = () => {
    setChildrenNumber((prevState) => prevState + 1);
  };

  const handleCFISubmit = (data) => {
    setChildren((prevState) => ({ ...prevState, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleData(children);
    if (await handleSignup()) {
      navigation("Success");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Child Information</h1>
      <Form id="currentForm" onSubmit={handleSubmit}>
        <button onClick={handleAddChild} className={styles.addChild}>
          Add Child
        </button>
        {new Array(childrenNumber).fill(undefined).map((child, index) => (
          <div key={index}>
            <div className={styles.childNumber}>Child {index + 1}</div>
            <ChildFormItem
              handleSubmit={handleCFISubmit}
              childNumber={index + 1}
            />
          </div>
        ))}
      </Form>
    </div>
  );
};

export default ChildForm;

interface CFIProps {
  handleSubmit: (data: any) => void;
  childNumber: number;
}

const ChildFormItem: React.FC<CFIProps> = (props) => {
  const { handleSubmit, childNumber } = props;

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(null);
  const [date, setDate] = useState("");
  const [clubList, setClubList] = useState<ClubProp[]>([]);
  const [selectedClubs, setSelectedClubs] = useState([]);
  const [clubInput, setClubInput] = useState("");

  useEffect(() => {
    fetch("/api/clubs")
      .then((res) => res.json())
      .then((data) => {
        setClubList(data.data);
      });
  }, []);

  console.log(date);

  useEffect(() => {
    handleSubmit({
      [childNumber]: {
        firstName,
        lastName,
        dob: date,
        email: "",
        phone: "",
        clubs: selectedClubs,
      } as UserProp,
    });
  }, [firstName, lastName]);

  return (
    <>
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
              {!!lastNameError}
            </Form.Control.Feedback>{" "}
          </Form.Group>
        </Col>
      </Row>
      <Form.Group>
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Clubs</Form.Label>
        <Select
          options={clubList.map((club) => ({
            value: club.id,
            label: club.title,
          }))}
          isMulti
          onChange={(e) => setSelectedClubs(e.map((item) => item.value))}
        />
      </Form.Group>
    </>
  );
};
