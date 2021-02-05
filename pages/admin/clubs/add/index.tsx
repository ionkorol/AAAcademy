import { AdminLayout } from "components/admin";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { ApiResProp, ClubProp } from "utils/interfaces";
import nookies from "nookies";
import firebaseAdmin from "utils/firebaseAdmin";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { route } from "next/dist/next-server/server/router";

interface Props {}

const Club: React.FC<Props> = (props) => {
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const availableCategories: Array<
    "Active" | "Creative" | "Educational" | "Musical"
  > = ["Active", "Creative", "Educational", "Musical"];
  const [categories, setCategories] = useState<
    Array<"Active" | "Creative" | "Educational" | "Musical">
  >([]);
  const [date, setDate] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [image, setImage] = useState("");
  const [teacher, setTeacher] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [requirement, setRequirement] = useState("");

  const router = useRouter();

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
    console.log(test);
    if (test) {
      const jsonData = (await (
        await fetch("/api/clubs", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            categories,
            date,
            time: { from: timeFrom, to: timeTo },
            image,
            teacher,
            description,
            price,
            requirements,
          } as ClubProp),
        })
      ).json()) as ApiResProp;

      if (jsonData.status) {
        alert("Added");
        router.push(`/admin/clubs/${jsonData.data}`);
      } else {
        alert(jsonData.error);
      }
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
    <AdminLayout>
      <Container>
        <h1>Add Club Page</h1>
        <hr></hr>
        {error ? <Alert variant="danger">{error}</Alert> : null}
        <Form onSubmit={handleSubmit} noValidate>
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
          <Button type="submit" className="w-100">
            Add
          </Button>
        </Form>
      </Container>
    </AdminLayout>
  );
};

export default Club;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    return {
      props: {
        uid,
      },
    };
  } catch (error) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};
