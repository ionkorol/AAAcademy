import { time } from "console";
import React from "react";

import styles from "./Schedule.module.scss";

const Schedule = () => {
  const timePeriods = [
    {
      from: "9AM",
      to: "10AM",
    },
    {
      from: "10AM",
      to: "11AM",
    },
    {
      from: "11AM",
      to: "12PM",
    },
    {
      from: "12PM",
      to: "1PM",
    },
    {
      from: "1PM",
      to: "2PM",
    },
    {
      from: "2PM",
      to: "3PM",
    },
  ];

  return (
    <div className={styles.container}>
      <h2>Schedule</h2>
      <hr></hr>
      <div className={styles.body}>
        {timePeriods.map((timePeriod, index) => (
          <div className={`${styles.timePeriod}  ${styles.active}`} key={index}>
            <div className={styles.time}>
              {timePeriod.from} - {timePeriod.to}
            </div>
            <div className={`${styles.club}`}>Club</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
