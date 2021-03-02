import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ApiResProp, StudentProp } from "utils/interfaces";

import styles from "./ChildCard.module.scss";

interface Props {
  data: StudentProp;
}

const ChildCard: React.FC<Props> = (props) => {
  const { data } = props;

  return (
    <div className={styles.container}>
      <Link href={`/account/students/${data.id}`}>
        <div className={styles.body}>
          <div className={styles.avatar}>
            <img
              src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png"
              width="50"
              height="50"
              alt=""
            />
          </div>
          <div className={styles.name}>
            {data.firstName} {data.lastName}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ChildCard;
