import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import firebase from "utils/firebaseClient";
import styles from "./Clubs.module.scss";
import { ClubProp } from "utils/interfaces";
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

interface ClubsProps {}
const ClubsContent: React.FC<ClubsProps> = (props) => {
  const [currentClubs, setCurrentClubs] = useState<ClubProp[]>([]);
  const [showClubModal, setShowClubModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState<ClubProp>(null);
  const [modalAction, setModalAction] = useState<"edit" | "add">("add");

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

  const handleAdd = () => {
    setSelectedClub(null);
    setModalAction("add");
    setShowClubModal(true);
  };

  const handleEdit = (clubData: ClubProp) => {
    setSelectedClub(clubData);
    setModalAction("edit");
    setShowClubModal(true);
  };

  const deleteClub = async (clubData: ClubProp) => {
    try {
      const res = await fetch("/api/clubs", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clubData),
      });
      console.log(await res.json());
    } catch (error) {
      setError(error);
    }
  };

  const modifyClub = async (clubData: ClubProp) => {
    if (modalAction === "edit") {
      try {
        const res = await fetch("/api/clubs", {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clubData),
        });
        console.log(await res.json());
      } catch (error) {
        setError(error);
      }
    } else {
      try {
        const res = await fetch("/api/clubs", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clubData),
        });
        console.log(await res.json());
      } catch (error) {
        setError(error);
      }
    }
    setShowClubModal(false);
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
            <button onClick={handleAdd}>Add</button>
          </div>
        </div>
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <div>Title</div>
            <div>Categories</div>
            <div>Date</div>
            <div>From</div>
            <div>To</div>
            <div>Image</div>
            <div>Teacher</div>
            <div>Actions</div>
          </div>
          <div className={styles.tableBody}>
            {currentClubs.map((club) => (
              <div className={styles.tableItem} key={club.id}>
                <div>{club.title}</div>
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
                <div>{club.time.from}</div>
                <div>{club.time.to}</div>
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
                  <button onClick={() => handleEdit(club)}>V</button>
                  <button
                    style={{ backgroundColor: "#ec7849" }}
                    onClick={() => deleteClub(club)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ClubModal
        show={showClubModal}
        handleClose={() => setShowClubModal(false)}
        clubData={selectedClub}
        onRun={modifyClub}
        error={error}
        action={modalAction}
      />
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
