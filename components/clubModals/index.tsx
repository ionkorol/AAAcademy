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
  const availableCategories: Array<
    "Active" | "Creative" | "Educational" | "Musical"
  > = ["Active", "Creative", "Educational", "Musical"];
  const [categories, setCategories] = useState<
    Array<"Active" | "Creative" | "Educational" | "Musical">
  >(clubData ? clubData.categories : []);
  const [date, setDate] = useState(clubData ? clubData.date : "");
  const [timeTo, setTimeTo] = useState(clubData ? clubData.time.to : "");
  const [timeFrom, setTimeFrom] = useState(clubData ? clubData.time.from : "");
  const [image, setImage] = useState(clubData ? clubData.image : "");
  const [teacher, setTeacher] = useState(clubData ? clubData.teacher : "");

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

  const handleCategoryClick = (category) => {
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
      console.log("False");
      // console.log(titleError);
      // console.log(categoriesError);
      // console.log(dateError);
      // console.log(timeError);
      // console.log(imageError);
      // console.log(teacherError);
      setFormValidated(false);
      return false;
    } else {
      console.log("True");
      setFormValidated(true);
      // console.log(titleError);
      // console.log(categoriesError);
      // console.log(dateError);
      // console.log(timeError);
      // console.log(imageError);
      // console.log(teacherError);
      return true;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() && (await formValidation())) {
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
          id="my-form"
          onSubmit={handleSubmit}
          validated={formValidated}
          noValidate
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
            </ListGroup>
            <Form.Control
              type="hidden"
              isInvalid={!!categoriesError}
              required
            />
            <Form.Control.Feedback type="invalid">
              {categoriesError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              isInvalid={!!dateError}
              required
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
                  isInvalid={!!timeError}
                />
                <Form.Control.Feedback type="invalid">
                  {timeError}
                </Form.Control.Feedback>
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
                  isInvalid={!!timeError}
                />
                <Form.Control.Feedback type="invalid">
                  {timeError}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Form.Row>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter To Image Url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              isInvalid={!!imageError}
            />
            <Form.Control.Feedback type="invalid">
              {imageError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Teacher</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter To Teacher Name"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              isInvalid={!!teacherError}
            />
            <Form.Control.Feedback type="invalid">
              {teacherError}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button form="my-form" type="submit">
          Save Changes
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClubModal;
