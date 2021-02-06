import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import firebase from "utils/firebaseClient";
import styles from "./Clubs.module.scss";
import { ApiResProp, ClubProp } from "utils/interfaces";
import { AdminLayout, ClubModal } from "components/admin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faMusic,
  faPalette,
  faVolleyballBall,
} from "@fortawesome/free-solid-svg-icons";
import firebaseAdmin from "utils/firebaseAdmin";
import firebaseClient from "utils/firebaseClient";
import nookies from "nookies";
import Link from "next/link";

interface ClubsProps {}
const ClubsContent: React.FC<ClubsProps> = (props) => {
  const [currentClubs, setCurrentClubs] = useState<ClubProp[]>([]);

  const [error, setError] = useState(null);

  // Real Time Updates
  useEffect(() => {
    const usnsub = firebase
      .firestore()
      .collection("clubs")
      .onSnapshot((data) => {
        setCurrentClubs(data.docs.map((doc) => doc.data() as ClubProp));
      });

    return () => usnsub();
  }, []);

  const deleteClub = async (clubData: ClubProp) => {
    try {
      const jsonData = (await (
        await fetch("/api/clubs", {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clubData),
        })
      ).json()) as ApiResProp;

      if (jsonData.status) {
        alert("Deleted");
      } else {
        alert(jsonData.error);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDublicateClub = async (club: ClubProp) => {
    delete club.id;
    const jsonData = (await (
      await fetch("/api/clubs", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...club,
        }),
      })
    ).json()) as ApiResProp;

    if (jsonData.status) {
      alert("Success: " + jsonData.data);
    } else {
      alert(jsonData.error);
    }
  };

  const categoryIcon = {
    Active: faVolleyballBall,
    Creative: faPalette,
    Educational: faBook,
    Musical: faMusic,
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h2>Clubs</h2>
        {error ? <Alert variant="danger"></Alert> : null}
        <div className={styles.controls}>
          <div className={styles.filter}></div>
          <div className={styles.actions}>
            <a href="/admin/clubs/add" target="_blank" rel="noreferrer">
              <Button variant="success">Add +</Button>
            </a>
          </div>
        </div>
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <div>Title</div>
            <div>Categories</div>
            <div>Date</div>
            <div>Time</div>
            <div>Age</div>
            <div>Image</div>
            <div>Teacher</div>
            <div>Actions</div>
          </div>
          <div className={styles.tableBody}>
            {currentClubs.map((club) => (
              <div className={styles.tableItem} key={club.id}>
                <div>
                  {club.title}
                  <small style={{ color: "red" }}>{club.price}</small>
                </div>
                <div>
                  {club.categories.map((category) => (
                    <FontAwesomeIcon
                      icon={categoryIcon[category]}
                      fixedWidth
                      key={category}
                    />
                  ))}
                </div>
                <div>{club.date}</div>
                <div>
                  {club.time.from} - {club.time.to}
                </div>
                <div>
                  {club.age ? `${club.age.from} - ${club.age.to}` : "0 - 0"}
                </div>
                <div>
                  <img
                    src={club.image}
                    alt={club.title}
                    width={50}
                    height={50}
                  />
                </div>
                <div>{club.teacher}</div>
                <div>
                  <a
                    href={`/admin/clubs/${club.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline-success">V</Button>
                  </a>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleDublicateClub(club)}
                  >
                    O
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => deleteClub(club)}
                  >
                    X
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ClubsContent;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  try {
    const { email } = await firebaseAdmin.auth().verifyIdToken(token);
    return {
      props: {},
    };
  } catch (error) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};
