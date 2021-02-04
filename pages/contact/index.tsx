import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { Layout } from "components/common";

import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";

import styles from "./Contact.module.scss";
import {
  faEnvelope,
  faMapPin,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { Icon } from "components/ui";

interface Props {}

const Contact: React.FC<Props> = (props) => {
  return (
    <Layout title="Contact Us | DuskBooks.com">
      <div className={styles.container}>
        <div className={styles.slider}>
          <div className={styles.inner}>
            <h1>Contact Us</h1>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.formContainer}>
            <ContactForm />
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.message}>
              {`We are here to help. If you have any question's don't hesitate to
            reach out to us.`}
            </div>
            <div className={styles.info}>
              <div>
                <Icon icon={faMapPin} size="1x" bgColor="primary" />
                <div>
                  <b>Address</b>
                  <p>3160 Old Atlanta Rd, Suwanee, GA 30024</p>
                </div>
              </div>
              <div>
                <Icon icon={faEnvelope} size="1x" bgColor="secondary" />
                <div>
                  <b>Email</b>
                  <p>alwaysactiveacademy@gmail.com</p>
                </div>
              </div>
              <div>
                <Icon icon={faPhone} size="1x" bgColor="tertiary" />
                <div>
                  <b>Phone</b>
                  <p>470-685-3631</p>
                  <p>404-747-6223</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Contact;

interface CFProps {}

const ContactForm: React.FC<CFProps> = (props) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  const [subject, setSubject] = useState("");
  const [subjectError, setSubjectError] = useState(null);

  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(null);

  const [formValidated, setFormValidated] = useState(true);

  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formValidated) {
      setSending(true);
      fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          from: email,
          subject,
          message: `${message}\n\nFrom: <${name}> ${email}`,
        }),
      })
        .then((data) => {
          setSending(false);
          setSubject("");
          setMessage("");
          console.log("Email Info", data);
        })
        .catch((error) => {
          setSending(false);
        });
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isInvalid={!!nameError}
          required
        />
        <Form.Control.Feedback type="invalid">
          {nameError}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isInvalid={!!emailError}
          required
        />
        <Form.Control.Feedback type="invalid">
          {emailError}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Subject</Form.Label>
        <Form.Control
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          isInvalid={!!subjectError}
          required
        />
        <Form.Control.Feedback type="invalid">
          {subjectError}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Message</Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Form.Control.Feedback type="invalid">
          {messageError}
        </Form.Control.Feedback>
      </Form.Group>
      <button disabled={sending} className={styles.sendForm} type="submit">
        {sending ? "Sending..." : "Send"}
      </button>
    </Form>
  );
};
