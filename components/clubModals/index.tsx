import React, { useEffect, useState } from "react";
import { Modal, Form, Alert, ListGroup, Col } from "react-bootstrap";
import firebaseClient from "../../utils/firebase";
import { ClubProp } from "../../utils/interfaces";

import styles from "./clubModal.module.scss";

interface Props {
  clubData: ClubProp;
  show: boolean;
  handleClose: () => void;
  onRun: (clubData: ClubProp) => void;
  error: string;
}

const ClubModal: React.FC<Props> = (props) => {
  const { show, handleClose, clubData, onRun, error } = props;

  const [title, setTitle] = useState(clubData ? clubData.title : "");
  const [titleError, setTitleError] = useState(null);
  const availableCategories = ["Active", "Creative", "Educational", "Musical"];
  const [categories, setCategories] = useState<string[]>(
    clubData ? clubData.categories : []
  );
  const [categoriesError, setCategoriesError] = useState(null);
  const [date, setDate] = useState(clubData ? clubData.date : "");
  const [dateError, setDateError] = useState(null);
  const [timeTo, setTimeTo] = useState(clubData ? clubData.time.to : "");
  const [timeFrom, setTimeFrom] = useState(clubData ? clubData.time.from : "");
  const [timeError, setTimeError] = useState(null);
  const [image, setImage] = useState(clubData ? clubData.image : "");
  const [imageError, setImageError] = useState(null);
  const [teacher, setTeacher] = useState(clubData ? clubData.teacher : "");
  const [teacherError, setTeacherError] = useState(null);

  const [formValidated, setFormValidated] = useState(false);

  useEffect(() => {
    setTitle(clubData ? clubData.title : "");
    setCategories(clubData ? clubData.categories : []);
    setDate(clubData ? clubData.date : "");
    setTimeTo(clubData ? clubData.time.to : "");
    setTimeFrom(clubData ? clubData.time.from : "");
    setImage(clubData ? clubData.image : "");
    setTeacher(clubData ? clubData.teacher : "");
  }, [clubData]);

  const handleCategoryClick = (category: string) => {
    console.log("Test");
    if (categories.includes(category)) {
      setCategories(categories.filter((item) => category !== item));
    } else {
      setCategories((prevState) => [...prevState, category]);
    }
  };

  const formValidation = async () => {
    // Title Validation
    // Exists
    const docSnap = await firebaseClient
      .firestore()
      .collection("clubs")
      .doc("title")
      .get();
    if (docSnap.exists) {
      setTitleError("Club with the same title already exists!");
    }

    // Categories Validation
    // Empty
    if (categories.length === 0) {
      setCategoriesError("No categories have been added!");
    }

    // Date Validation
    // Empty
    if (!date) {
      setDateError("Date has not been set!");
    }

    // Time Validation
    // Empty
    if (!timeFrom || !timeTo) {
      setTimeError("Time has not been set!");
    }

    // Image Validation
    // Empty
    if (!image) {
      setImageError("Image has not been set!");
    }

    // Teacher Validation
    // Empty
    if (!teacher) {
      setTeacherError("Teacher has not been set!");
    }

    if (
      titleError ||
      categoriesError ||
      dateError ||
      timeError ||
      imageError ||
      teacherError
    ) {
      console.log(titleError);
      console.log(categoriesError);
      console.log(dateError);
      console.log(timeError);
      console.log(imageError);
      console.log(teacherError);
      setFormValidated(false);
      return false;
    } else {
      setFormValidated(true);
      console.log(titleError);
      console.log(categoriesError);
      console.log(dateError);
      console.log(timeError);
      console.log(imageError);
      console.log(teacherError);
      return true;
    }
  };

  const handleSubmit = async () => {
    await formValidation();
    console.log(formValidated);
    if (formValidated) {
      onRun({
        title,
        categories,
        date,
        time: {
          from: timeFrom,
          to: timeTo,
        },
        image,
        teacher,
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
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          validated={formValidated}
        >
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              {titleError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Categories</Form.Label>
            <ListGroup>
              {availableCategories.map((category, index) => (
                <ListGroup.Item
                  active={categories.includes(category) ? true : false}
                  key={index}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </ListGroup.Item>
              ))}
              <Form.Control.Feedback type="invalid">
                {categoriesError}
              </Form.Control.Feedback>
            </ListGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              {dateError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Time From</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter From Time"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Time To</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter To Time"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Form.Control.Feedback type="invalid">
              {timeError}
            </Form.Control.Feedback>
          </Form.Row>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter To Image Url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Teacher</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter To Teacher Name"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={handleSubmit}>Save Changes</button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClubModal;
