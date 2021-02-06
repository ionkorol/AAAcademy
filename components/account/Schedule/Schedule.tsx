import { time } from "console";
import React from "react";
import { ClubProp } from "utils/interfaces";

import styles from "./Schedule.module.scss";

interface Props {
  data: ClubProp[];
}

const Schedule: React.FC<Props> = (props) => {
  const { data } = props;

  const timePeriods = [
    {
      from: 9,
      to: 10,
    },
    {
      from: 10,
      to: 11,
    },
    {
      from: 11,
      to: 12,
    },
    {
      from: 12,
      to: 13,
    },
    {
      from: 13,
      to: 14,
    },
    {
      from: 14,
      to: 15,
    },
  ];

  const handleRender = () => {
    const jsx = timePeriods.map((timePeriod, index) => {
      const clubQuery = data.filter(
        (club) => Number(club.time.from) === timePeriod.from
      );

      return (
        <div
          className={`${styles.timePeriod}  ${
            clubQuery.length ? styles[clubQuery[0].categories[0].toLowerCase()] : null
          }`}
          key={index}
        >
          <div className={styles.time}>
            {timePeriod.from}:00 - {timePeriod.to}:00
          </div>
          <div className={styles.club}>
            {clubQuery.length ? clubQuery[0].title : "Empty"}
          </div>
        </div>
      );
    });

    return jsx;
  };

  return (
    <div className={styles.container}>
      <h2>Schedule</h2>
      <hr></hr>
      <div className={styles.body}>
        {handleRender()}
      </div>
    </div>
  );
};

export default Schedule;
