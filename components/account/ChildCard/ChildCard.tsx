import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ApiResProp, StudentProp } from "utils/interfaces";

import styles from "./ChildCard.module.scss";

interface Props {
  id: string;
}

const ChildCard: React.FC<Props> = (props) => {
  const { id } = props;

  const [error, setError] = useState(null);
  const [data, setData] = useState<StudentProp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/students/${id}`)
      .then((res) => res.json())
      .then((data: ApiResProp) => {
        if (data.status) {
          setData(data.data as StudentProp);
        } else {
          setError(data.error);
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
        "Loading... "
      ) : (
        <Link href={`/account/children/${data.id}`}>
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
      )}
    </div>
  );
};

export default ChildCard;
