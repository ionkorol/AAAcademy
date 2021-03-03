import { AdminLayout } from "components/admin";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import nookies from "nookies";
import firebaseAdmin from "utils/firebaseAdmin";
import { ApiResProp, ParentProp } from "utils/interfaces";

interface Props {
  data: ParentProp;
}

const User: React.FC<Props> = (props) => {
  const { data } = props;

  const [firstName, setFirstName] = useState(data.firstName);
  const [lastName, setLastName] = useState(data.lastName);
  const [email, setEmail] = useState(data.email);
  const [phone, setPhone] = useState(data.phone);

  const [errors, setErrors] = useState({
    firstName: null,
    lastName: null,
    email: null,
    type: null,
    phone: null,
  });

  const formValidation = async () => {
    // First Name Validation
    // Empty
    if (!firstName) {
      setErrors((prevState) => ({
        ...prevState,
        firstName: "Name has not been set!",
      }));
      return false;
    }
    // Last Name Validation
    // Empty
    if (!lastName) {
      setErrors((prevState) => ({
        ...prevState,
        lastName: "Name has not been set!",
      }));
      return false;
    }

    // Email Validation
    // Empty
    if (!email) {
      setErrors((prevState) => ({
        ...prevState,
        email: "Email has not been set!",
      }));
      return false;
    }

    // Phone Validation
    // Empty
    if (!phone) {
      setErrors((prevState) => ({
        ...prevState,
        phone: "Phone has not been set!",
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
      console.log("Test");
    }
  };

  const handleUserDelete = async () => {
    try {
      const userJson = (await (
        await fetch(`/api/parents/${data.id}`, {
          method: "DELETE",
        })
      ).json()) as ApiResProp;

      if (userJson.status) {
        alert("User Deleted");
      } else {
        console.log(userJson.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(data.createdAt)

  return (
    <AdminLayout>
      <Container>
        <h1>
          {data.firstName} {data.lastName} - Edit Page
        </h1>
        <Form id="user-form" onSubmit={handleSubmit} noValidate>
          <Col>
            <Row>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Col>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Save
          </Button>
        </Form>
        <Button onClick={handleUserDelete} variant="outline-danger mt-5 w-100">
          Delete
        </Button>
      </Container>
    </AdminLayout>
  );
};

export default User;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query;
  const { token } = nookies.get(ctx);

  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const jsonData = (await (
      await fetch(`${process.env.SERVER}/api/parents/${id}`)
    ).json()) as ApiResProp;

    if (jsonData.status) {
      return {
        props: {
          data: jsonData.data,
        },
      };
    } else {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
      return {
        props: {} as never,
      };
    }
  } catch (error) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};
