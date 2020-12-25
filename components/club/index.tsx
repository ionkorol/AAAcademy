import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbtack,
  faClock,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

import styles from "./club.module.scss";
import { ClubProp } from "../../utils/interfaces";

interface Props {
  data: ClubProp;
}

const Club: React.FC<Props> = (props) => {
  const { data } = props;

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <img src={data.image} alt={data.title} />
        <div className={styles.date}>
          <FontAwesomeIcon icon={faCalendar} fixedWidth />
          {data.date}
        </div>
      </div>
      <div className={styles.title}>{data.title}</div>
      <div className={styles.body}>
        <div className={styles.location}>
          <FontAwesomeIcon icon={faThumbtack} fixedWidth />
          Friendship Christian School
        </div>
        <div className={styles.time}>
          <FontAwesomeIcon icon={faClock} fixedWidth />
          {data.time.from}
          {" TO "}
          {data.time.to}
        </div>
        <hr className={styles.hr} />
        <div className={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          tincidunt rutrum.
        </div>
      </div>
    </div>
  );
};

export default Club;
