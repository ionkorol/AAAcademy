import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Alert,
  ListGroup,
  Col,
  InputGroup,
  Button,
  ListGroupItem,
} from "react-bootstrap";
import firebaseClient from "utils/firebaseClient";
import { ClubProp } from "utils/interfaces";

import styles from "./clubModal.module.scss";

interface Props {
  clubData: ClubProp;
  show: boolean;
  handleClose: () => void;
  onRun: (clubData: ClubProp) => void;
  error: string;
  action: "edit" | "add";
}

const ClubModal: React.FC<Props> = (props) => {
  const { show, handleClose, clubData, onRun, error, action } = props;

  const [title, setTitle] = useState(clubData ? clubData.title : "");
  const [price, setPrice] = useState(clubData ? clubData.price : 0);
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
  const [description, setDescription] = useState(
    clubData ? clubData.description : ""
  );
  const [requirements, setRequirements] = useState([]);
  const [requirement, setRequirement] = useState("");

  const [errors, setErrors] = useState({
    title: null,
    price: null,
    categories: null,
    date: null,
    fromTime: null,
    toTime: null,
    image: null,
    teacher: null,
    description: null,
    requirements: null,
  });

  console.log(requirements);

  // Change info when opening new
  useEffect(() => {
    if (clubData) {
      setTitle(clubData.title);
      setPrice(clubData.price);
      setCategories(clubData.categories);
      setDate(clubData.date);
      setTimeTo(clubData.time.to);
      setTimeFrom(clubData.time.from);
      setImage(clubData.image);
      setTeacher(clubData.teacher);
      setDescription(clubData.description);
      setRequirements(clubData.requirements ? clubData.requirements : []);
    } else {
      setTitle("");
      setPrice(0);
      setCategories([]);
      setDate("");
      setTimeTo("");
      setTimeFrom("");
      setImage("");
      setTeacher("");
      setDescription("");
      setRequirements([]);
    }
    setRequirement("");
    setErrors({
      title: null,
      price: null,
      categories: null,
      date: null,
      fromTime: null,
      toTime: null,
      image: null,
      teacher: null,
      description: null,
      requirements: null,
    });
  }, [clubData, show]);

  const handleCategoryClick = (category) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((item) => category !== item));
    } else {
      setCategories((prevState) => [...prevState, category]);
    }
  };

  const formValidation = async () => {
    // Title Validation
    // Empty
    if (!title) {
      setErrors((prevState) => ({
        ...prevState,
        title: "Title has not been set!",
      }));
      return false;
    }
    // Exists
    if (action === "add") {
      const docSnap = await firebaseClient
        .firestore()
        .collection("clubs")
        .doc(title)
        .get();
      if (docSnap.exists) {
        setErrors((prevState) => ({
          ...prevState,
          title: "Club already Exists",
        }));
        return false;
      }
    }

    // Categories Validation
    // Empty
    if (categories.length === 0) {
      setErrors((prevState) => ({
        ...prevState,
        categories: "No categories have been added!",
      }));
      return false;
    }

    // Date Validation
    // Empty
    if (!date) {
      setErrors((prevState) => ({
        ...prevState,
        date: "Date has not been set!",
      }));
      return false;
    }

    // From Time Validation
    // Empty
    if (!timeFrom) {
      setErrors((prevState) => ({
        ...prevState,
        fromTime: "Time has not been set!",
      }));
      return false;
    }

    // To Time Validation
    // Empty
    if (!timeTo) {
      setErrors((prevState) => ({
        ...prevState,
        toTime: "Time has not been set!",
      }));
      return false;
    }

    // Image Validation
    // Empty
    if (!image) {
      setErrors((prevState) => ({
        ...prevState,
        image: "Image has not been set!",
      }));
      return false;
    }

    // Teacher Validation
    // Empty
    if (!teacher) {
      setErrors((prevState) => ({
        ...prevState,
        teacher: "Teacher has not been set!",
      }));
      return false;
    }

    // Description Validation
    // Empty
    if (!description) {
      setErrors((prevState) => ({
        ...prevState,
        description: "Description has not been set!",
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
        title,
        categories,
        date,
        time: {
          from: timeFrom,
          to: timeTo,
        },
        image,
        teacher,
        description,
        requirements,
        price,
      });
    }
  };

  const handleAddRequirement = () => {
    setRequirements((prevState) => [...prevState, requirement]);
    setRequirement("");
  };

  const handleDeleteRequirement = (req: string) => {
    setRequirements((prevState) => prevState.filter((item) => item !== req));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error ? <Alert variant="danger">{error}</Alert> : null}
        <Form id="my-form" onSubmit={handleSubmit} noValidate>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!errors.title}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              isInvalid={!!errors.price}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.price}
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
              isInvalid={!!errors.categories}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.categories}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              isInvalid={!!errors.date}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.date}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Row>
            <Col>
              <Form.Group>
                <Form.Label>Time From</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter From Time"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                  isInvalid={!!errors.fromTime}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fromTime}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Time To</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter To Time"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                  isInvalid={!!errors.toTime}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.toTime}
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
              isInvalid={!!errors.image}
            />
            <Form.Control.Feedback type="invalid">
              {errors.image}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Teacher</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter To Teacher Name"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              isInvalid={!!errors.teacher}
            />
            <Form.Control.Feedback type="invalid">
              {errors.teacher}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Requirements</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Add Requirement"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
              />
              <InputGroup.Append>
                <Button
                  variant="outline-success"
                  onClick={handleAddRequirement}
                >
                  Add
                </Button>
              </InputGroup.Append>
            </InputGroup>
            <ListGroup>
              {requirements
                ? requirements.map((req, index) => (
                    <ListGroupItem
                      className="d-flex justify-content-between"
                      key={index}
                    >
                      <div>{req}</div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteRequirement(req)}
                      >
                        x
                      </Button>
                    </ListGroupItem>
                  ))
                : null}
            </ListGroup>
            <Form.Control.Feedback type="invalid">
              {errors.teacher}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter To description Name"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
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
