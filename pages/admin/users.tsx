import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { useRouter } from "next/router";
import firebaseClient from "../../utils/firebaseClient";
import styles from "./Users.module.scss";
import firebaseAdmin from "../../utils/firebaseAdmin";
import { UserProp } from "../../utils/interfaces";
import { AdminLayout, UserModal } from "../../components/admin";

interface UsersProps {}
const UsersContent: React.FC<UsersProps> = (props) => {
  const [currentUsers, setCurrentUsers] = useState<UserProp[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProp>(null);
  const [modalAction, setModalAction] = useState<"edit" | "add">("add");
  const [error, setError] = useState(null);

  // Real Time Updates
  useEffect(() => {
    const usnsub = firebaseClient
      .firestore()
      .collection("users")
      .onSnapshot((data) => {
        setCurrentUsers(data.docs.map((doc) => doc.data() as UserProp));
      });

    return () => usnsub();
  }, []);

  const handleAdd = () => {
    setSelectedUser(null);
    setModalAction("add");
    setShowUserModal(true);
  };

  const handleEdit = (userData: UserProp) => {
    setSelectedUser(userData);
    setModalAction("edit");
    setShowUserModal(true);
  };

  // TODO: Figure the id or the add part of it
  const modifyUser = async (userData: UserProp) => {
    console.log(userData);
    if (modalAction === "edit") {
      try {
        const res = await fetch("/api/users", {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        console.log(await res.json());
      } catch (error) {
        setError(error);
      }
    } else {
      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
        console.log(await res.json());
      } catch (error) {
        console.log(error);
        setError(error);
      }
    }
    setShowUserModal(false);
  };

  const deleteUser = async (userData: UserProp) => {
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log(await res.json());
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h2>Users</h2>
        {error ? <Alert variant="danger"></Alert> : null}
        <div className={styles.controls}>
          <div className={styles.filter}></div>
          <div className={styles.actions}>
            <button onClick={handleAdd}>Add</button>
          </div>
        </div>
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <div>Name</div>
            <div>Email</div>
            <div>Type</div>
            <div>Actions</div>
          </div>
          <div className={styles.tableBody}>
            {currentUsers.map((user) => (
              <div className={styles.tableItem} key={user.email}>
                <div>{user.firstName} {user.lastName}</div>
                <div>{user.email}</div>
                <div>{user.type}</div>
                <div>
                  <button onClick={() => handleEdit(user)}>V</button>
                  <button
                    style={{ backgroundColor: "#ec7849" }}
                    onClick={() => deleteUser(user)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <UserModal
        show={showUserModal}
        handleClose={() => setShowUserModal(false)}
        userData={selectedUser}
        onRun={modifyUser}
        error={error}
        action={modalAction}
      />
    </AdminLayout>
  );
};

export default UsersContent;
