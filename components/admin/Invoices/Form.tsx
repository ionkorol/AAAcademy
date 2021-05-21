import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { ClubProp, LineItemProp, ParentProp } from "utils/interfaces";

const InvoiceForm = () => {
  const [users, setUsers] = useState<ParentProp[]>([]);
  const [clubs, setClubs] = useState<ClubProp[]>([]);

  const [lineItems, setLineItems] = useState<LineItemProp[]>([]);

  useEffect(() => {
    // Get Parents
    fetch("/api/parents")
      .then((res) => res.json())
      .then((data) => setUsers(data));
    // Get Clubs
    fetch("/api/clubs")
      .then((res) => res.json())
      .then((data) => setClubs(data));
  }, []);

  const addLineItemProp = () => {};

  return (
    <Form>
      <Form.Group>
        <Form.Label>Select User</Form.Label>
        <Form.Control as="select">
          {users.map((user) => (
            <option key={user.id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Add Clubs</Form.Label>
        <Form.Control as="select">
          {clubs.map((club) => (
            <option key={club.id}>
              {club.title} ({club.time.from} - {club.time.to})
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Table>
        <thead>
          <tr>
            <th></th>
          </tr>
        </thead>
      </Table>
    </Form>
  );
};

export default InvoiceForm;
