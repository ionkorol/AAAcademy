import { AccountLayout } from "components/account";
import React from "react";
import { Button, Container, Form, InputGroup, Table } from "react-bootstrap";

const Coupons = () => {
  return (
    <AccountLayout>
      <Container>
        <h1>Coupons</h1>
        <hr></hr>
        <Form>
          <InputGroup className="mb-3">
            <Form.Control placeholder="Input Coupon Number" />
            <InputGroup.Append>
              <Button variant="outline-success">Submit</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
        <Table>
          <thead>
            <tr>
              <th>Coupon #</th>
              <th className="text-right">Discount Value</th>
            </tr>
          </thead>
          <tbody>
            <tr >
              <td>Test Coupon 1</td>
              <td className="text-right">- 50%</td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </AccountLayout>
  );
};

export default Coupons;
