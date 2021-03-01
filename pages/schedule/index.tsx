import React from "react";
import { Layout } from "components/common";
import { Container, Table } from "react-bootstrap";
import styles from "./Schedule.module.scss";

interface Props {}

const Schedule: React.FC<Props> = (props) => {
  return (
    <Layout title="Schedule">
      <div className={styles.slider}>
        <div className={styles.inner}>
          <h1>Schedule</h1>
        </div>
      </div>
      <Container className="my-5">
        {/* <Table>
        <thead>
          <tr>
            <th>Class</th>
            <th>Location</th>
            <th>09:00-10:00</th>
            <th>10:00-11:00</th>
            <th>11:00-12:00</th>
            <th>12:00-01:00</th>
            <th>01:00-02:00</th>
            <th>02:00-03:00</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Basketball</td>
            <td>Gym</td>
            <td></td>
            <td className="bg-">Grade 1 - Grade 8</td>
            <td>Grade 9 - Grade 12</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </Table> */}
        <img src="https://firebasestorage.googleapis.com/v0/b/alwaysactive-83134.appspot.com/o/schedule%2Fschedule.PNG?alt=media&token=11ad218f-e1ab-483e-a6a7-bea3620c8342" className={styles.schedule} />
      </Container>
    </Layout>
  );
};

export default Schedule;
