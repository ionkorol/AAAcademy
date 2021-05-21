import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Form } from "react-bootstrap";
interface Props {
  setActiveTab: Dispatch<SetStateAction<string>>;
}
const Terms: React.FC<Props> = (props) => {
  const { setActiveTab } = props;
  const handlePrevious = () => {
    setActiveTab("ParentInfo");
  };
  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveTab("Payment");
  };

  return (
    <div>
      <Form onSubmit={handleNext}>
        <h1>Terms & Conditions</h1>
        <p>
          <b>Indemnity Agreement</b>
          <br></br>FOR GOOD AND VALUABLE CONSIDERATION, I the parent and/or
          legal guardian of the child named above (and the children named on the
          sibling form) and the undersigned hereby indemnifies and saves
          harmless New Life Church, FCS and AAA volunteers from and against any and
          all claims, demands, actions, suits, losses, costs, charges, expenses,
          damages and liabilities whatsoever which New Life Church, FCS and AAA may
          pay, sustain, suffer or incur by reason of or in connection with Kid’s
          Summer Day Camp, including, without limiting the generality of the
          foregoing, all costs and expenses (including legal expenses) incurred
          in connection with any such loss or damage.
        </p>
        <Form.Group>
          <Form.Check type="checkbox" label="I agree" required />
        </Form.Group>
        <p>
          <b>Medical Authorization Of Minor</b>
          <br></br>I do hereby solemnly swear that I have legal custody of the
          aforementioned minor child(ren). I grant my authorization and consent
          for New Life Church/FCS/AAA volunteers, (hereafter “Supervising Adult”) to
          administer general first aid treatment for any minor injuries or
          illnesses experienced by the minor. If the injury or illness is life
          threatening or in need of emergency treatment, I authorize the
          Supervising Adult to summon any and all professional emergency
          personnel to attend, transport, and treat the participant and to issue
          consent for any X-ray, anesthetic, blood transfusion, medication, or
          other medical diagnosis, treatment, or hospital care deemed advisable
          by, and to be rendered under the general supervision of, any licensed
          physician, surgeon, dentist, hospital, or other medical professional
          or institution duly licensed to practice in the state in which such
          treatment is to occur. It is understood that this authorization is
          given in advance of any such medical treatment, but is given to
          provide authority and power on the part of the Supervising Adult in
          the exercise of his or her best judgment upon the advice of any such
          medical or emergency personnel. I verify that I and my child(ren)
          named above and on the sibling form are in good health and capable of
          participating in strenuous activities, and whenever necessary, will
          tailor my/their activities to those within the bounds of my/their
          physical health. This authorization is effective commencing on the
          14th day of June, 2021 and expiring on the 18th day of June 2021.
        </p>
        <Form.Group>
          <Form.Check type="checkbox" label="I agree" required />
        </Form.Group>
        <p>
          <b>Photography Consent</b>
          <br></br>I hereby give New Life Church and Friendship Christian
          School, it's successors and assigns, the absolute and irrevocable
          right and permission with respect to photographs, videos, motion
          pictures, and/or sound recordings being taken of my child(ren): (a) to
          use, reuse, publish and republish in whole or in part and (b) to use
          my child(ren)’s name. I further release New Life Church, Friendship
          Christian School and any other entity from any claims and demands
          arising out of the use of same.
        </p>
        <Form.Group>
          <Form.Check type="checkbox" label="I agree" required />
        </Form.Group>
        <p>
          <b>Coronavirus Precaution</b>
          <br></br>I agree to keep my child(ren) at home if they exhibit any
          sign of illness.
        </p>
        <Form.Group>
          <Form.Check type="checkbox" label="I agree" required />
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

export default Terms;
