import { projectManagement } from "firebase-admin";
import { useRegistrationData } from "hooks/useRegistrationData";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Row, Col, InputGroup, Form } from "react-bootstrap";

interface Props {
  setActiveTab: Dispatch<SetStateAction<string>>;
}
const ParentInfo: React.FC<Props> = (props) => {
  const { setActiveTab } = props;
  const registrationData = useRegistrationData();

  const handlePrevious = () => {
    setActiveTab("ChildrenInfo");
  };
  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveTab("Terms");
  };

  console.log(registrationData);
  return (
    <div>
      <Form onSubmit={handleNext}>
        <h4>Parent Info</h4>
        <hr></hr>
        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={registrationData.parentData.name}
                onChange={(e) =>
                  registrationData.setParentAttribute("name", e.target.value)
                }
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={registrationData.parentData.phone}
                onChange={(e) =>
                  registrationData.setParentAttribute("phone", e.target.value)
                }
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            value={registrationData.parentData.address}
            onChange={(e) =>
              registrationData.setParentAttribute("address", e.target.value)
            }
            required
          />
        </Form.Group>
        <h2>Emergency Contact</h2>
        <hr></hr>
        <Form.Row>
          <Col>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={registrationData.emergencyContact.name}
                onChange={(e) =>
                  registrationData.setEmergencyContactAttribute(
                    "name",
                    e.target.value
                  )
                }
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                value={registrationData.emergencyContact.phone}
                onChange={(e) =>
                  registrationData.setEmergencyContactAttribute(
                    "phone",
                    e.target.value
                  )
                }
                required
              />
            </Form.Group>
          </Col>
        </Form.Row>

        <Form.Group>
          <Form.Label>
            Does your child have any allergies, medical needs, or limitations to
            activities?
          </Form.Label>
          <Form.Control
            onChange={(e) =>
              registrationData.setMedicalCondition(
                e.target.value === "Yes" ? true : false
              )
            }
            as="select"
          >
            <option>No</option>
            <option>Yes</option>
          </Form.Control>
        </Form.Group>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="button" onClick={handlePrevious}>
            Previous
          </button>
          <button type="submit">Next</button>
        </div>
      </Form>
    </div>
  );
};

export default ParentInfo;
