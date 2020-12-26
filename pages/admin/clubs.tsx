import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { Alert, Table, Toast } from "react-bootstrap";
import { useRouter } from "next/router";
import firebase from "../../utils/firebase";
import styles from "./Clubs.module.scss";
import firebaseAdmin from "../../utils/firebaseAdmin";
import { ClubProp } from "../../utils/interfaces";
import { AddUserModal, AdminLayout, EditUserModal } from "../../components";
import ClubModal from "../../components/clubModals";

interface ClubsProps {
  clubsData?: ClubProp[];
}
const ClubsContent: React.FC<ClubsProps> = (props) => {
  const { clubsData } = props;

  const [currentClubs, setCurrentClubs] = useState<ClubProp[]>(clubsData);
  const [showAddClub, setShowAddClub] = useState(false);
  const [showEditClub, setShowEditClub] = useState(false);
  const [showClubCreated, setShowClubCreated] = useState(true);
  const [selectedClub, setSelectedClub] = useState<ClubProp | null>(null);

  const [error, setError] = useState(null);

  const router = useRouter();

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
    setShowAddClub(true);
  };

  const handleEdit = (clubData: ClubProp) => {
    setSelectedClub(clubData);
    setShowAddClub(true);
  };

  const deleteClub = async (clubData: ClubProp) => {
    try {
      await firebase
        .firestore()
        .collection("users")
        .doc(clubData.title)
        .delete();
    } catch (error) {
      setError(error.message);
    }
  };

  const modifyClub = async (clubData: ClubProp) => {
    try {
      await firebase
        .firestore()
        .collection("clubs")
        .doc(clubData.title)
        .set({
          ...clubData,
        });
      setShowAddClub(false);
    } catch (error) {
      setError(error.message);
    }
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
              <div className={styles.tableItem} key={club.title}>
                <div>{club.title}</div>
                <div>{club.categories.toString()}</div>
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
        show={showAddClub}
        handleClose={() => setShowAddClub(false)}
        clubData={selectedClub}
        onRun={modifyClub}
        error={error}
      />
    </AdminLayout>
  );
};

export default ClubsContent;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const clubsQuery = await firebaseAdmin
      .firestore()
      .collection("clubs")
      .get();
    const clubsData = clubsQuery.docs.map((clubSnap) => clubSnap.data());

    return {
      props: {
        clubsData,
      },
    };
  } catch (error) {
    return {
      props: {
        error,
      },
    };
  }
};
