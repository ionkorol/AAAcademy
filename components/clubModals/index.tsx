import React, { useEffect, useState } from "react";
import { Modal, Form, Alert, ListGroup, Col } from "react-bootstrap";
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
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>(
    clubData ? clubData.categories : []
  );
  const [date, setDate] = useState(clubData ? clubData.date : "");
  const [timeTo, setTimeTo] = useState(clubData ? clubData.time.to : "");
  const [timeFrom, setTimeFrom] = useState(clubData ? clubData.time.from : "");
  const [image, setImage] = useState(clubData ? clubData.image : "");
  const [teacher, setTeacher] = useState(clubData ? clubData.teacher : "");

  useEffect(() => {
    setTitle(clubData ? clubData.title : "");
    setCategories(clubData ? clubData.categories : []);
    setDate(clubData ? clubData.date : "");
    setTimeTo(clubData ? clubData.time.to : "");
    setTimeFrom(clubData ? clubData.time.from : "");
    setImage(clubData ? clubData.image : "");
    setTeacher(clubData ? clubData.teacher : "");
  }, [clubData]);

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
          }}
        >
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Categories</Form.Label>
            <div className={styles.categoryInput}>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <button
                onClick={() =>
                  setCategories((prevState) => [...prevState, category])
                }
              >
                v
              </button>
            </div>
            <ListGroup>
              {categories.map((category, index) => (
                <ListGroup.Item key={index}>
                  <div className={styles.category}>
                    <span>{category}</span>
                    <button
                      onClick={() =>
                        setCategories(
                          categories.filter((item) => item !== category)
                        )
                      }
                    >
                      x
                    </button>
                  </div>
                </ListGroup.Item>
              ))}
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
        <button
          onClick={() =>
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
            })
          }
        >
          Save Changes
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClubModal;
