import React, { useEffect, useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { ChildProp, ClubProp, ParentProp, UserProp } from "utils/interfaces";
import Select from "react-select";

import styles from "./ChildForm.module.scss";

interface Props {
  navigation: React.Dispatch<any>;
  handleData: React.Dispatch<any>;
  parentData: UserProp;
  data: ChildProp[];
}

const ChildForm: React.FC<Props> = (props) => {
  const { navigation, handleData, data, parentData } = props;

  const [children, setChildren] = useState(data);

  const [clubList, setClubList] = useState<ClubProp[]>([]);

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
        email: parentData.email,
        phone: "",
        clubs: [],
      } as ChildProp,
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
      <Form id="currentForm" onSubmit={handleSubmit}>
        <button
          type="button"
          onClick={handleAddChild}
          className={styles.addChild}
        >
          Add Child
        </button>
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
  const [dobError, setDobError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);

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
          isInvalid={!!dobError}
          required
        />
        <Form.Control.Feedback type="invalid">{dobError}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Phone</Form.Label>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>+1</InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            type="tel"
            value={data.phone}
            onChange={(e) => handleSubmit("phone", e.target.value, childNumber)}
            isInvalid={!!phoneError}
            required
          />
        </InputGroup>
        <Form.Control.Feedback type="invalid">
          {phoneError}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Email (Optional)</Form.Label>
        <Form.Control
          type="email"
          value={data.email}
          onChange={(e) => handleSubmit("email", e.target.value, childNumber)}
          required
        />
        <Form.Control.Feedback type="invalid">
          {emailError}
        </Form.Control.Feedback>
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
          onChange={(e) => {
            handleSubmit(
              "clubs",
              e ? e.map((item) => item.value) : [],
              childNumber
            );
          }}
        />
      </Form.Group>
    </>
  );
};
