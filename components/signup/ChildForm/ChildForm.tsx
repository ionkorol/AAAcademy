import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import firebaseClient from "utils/firebaseClient";
import { ChildProp, ClubProp, UserProp } from "utils/interfaces";
import Select from "react-select";

import styles from "./ChildForm.module.scss";

interface Props {
  navigation: React.Dispatch<any>;
  handleData: React.Dispatch<any>;
  data: ChildProp[];
}

const ChildForm: React.FC<Props> = (props) => {
  const { navigation, handleData, data } = props;

  const [children, setChildren] = useState(data);

  const [clubList, setClubList] = useState<ClubProp[]>([]);

  // const [children, setChildren] = useState([]);

  useEffect(() => {
    fetch("/api/clubs")
      .then((res) => res.json())
      .then((data) => {
        setClubList(data.data);
      });
  }, []);

  const handleAddChild = () => {
    setChildren([
      ...children,
      {
        firstName: "",
        lastName: "",
        dob: "",
        type: "Student",
        email: "student@gmail.com",
        phone: "",
        clubs: [],
      },
    ]);
  };

  const handleRemoveChild = (child: ChildProp) => {
    setChildren((prevState) =>
      prevState.filter(
        (item) =>
          item.firstName !== child.firstName && item.lastName !== child.lastName
      )
    );
  };

  console.log(children);

  const handleCFISubmit = (field, data, childIndex) => {
    setChildren((prevState) =>
      prevState.map((item, index) =>
        index === childIndex ? { ...item, [field]: data } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleData(children);
    navigation("Payment");
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Child Information</h1>
        <button onClick={() => navigation("ParentForm")}>Back</button>
      </div>
      <Form id="currentForm" onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={handleAddChild}
          className={styles.addChild}
        >
          Add Child
        </button>
        {children.map((child, index) => (
          <div className={styles.cfiContainer} key={index}>
            <div className={styles.childNumber}>Child {index + 1}</div>
            <button
              type="button"
              onClick={() => handleRemoveChild(child)}
              className={styles.removeButton}
            >
              x
            </button>
            <ChildFormItem
              handleSubmit={handleCFISubmit}
              childNumber={index}
              data={child}
              clubList={clubList}
            />
          </div>
        ))}
        <button type="submit">Next</button>
      </Form>
    </div>
  );
};

export default ChildForm;

interface CFIProps {
  handleSubmit: (field: string, data: any, childIndex: number) => void;
  childNumber: number;
  data: ChildProp;
  clubList: ClubProp[];
}

const ChildFormItem: React.FC<CFIProps> = (props) => {
  const { handleSubmit, childNumber, data, clubList } = props;

  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);

  return (
    <>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={data.firstName}
              onChange={(e) =>
                handleSubmit("firstName", e.target.value, childNumber)
              }
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
              value={data.lastName}
              onChange={(e) =>
                handleSubmit("lastName", e.target.value, childNumber)
              }
              isInvalid={!!lastNameError}
              required
            />
            <Form.Control.Feedback type="invalid">
              {!!lastNameError}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group>
        <Form.Label>Date of Birth</Form.Label>
        <Form.Control
          type="date"
          value={data.dob}
          onChange={(e) => handleSubmit("dob", e.target.value, childNumber)}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Clubs</Form.Label>
        <Select
          value={
            clubList.length &&
            data.clubs.map((selectedClub) => ({
              value: selectedClub,
              label: selectedClub.title,
            }))
          }
          options={clubList.map((club) => ({
            value: club,
            label: club.title,
          }))}
          isMulti
          onChange={(e) =>
            handleSubmit(
              "clubs",
              e.map((item) => item.value),
              childNumber
            )
          }
        />
      </Form.Group>
    </>
  );
};
