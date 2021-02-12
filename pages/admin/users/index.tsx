import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import firebaseClient from "utils/firebaseClient";
import styles from "./Users.module.scss";
import firebaseAdmin from "utils/firebaseAdmin";
import { UserProp } from "utils/interfaces";
import { AdminLayout } from "components/admin";
import nookies from "nookies";

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
      const res = await fetch(`/api/users/${userData.id}`, {
        method: "DELETE",
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
            <Button variant="success" onClick={handleAdd}>
              Add +
            </Button>
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
              <div className={styles.tableItem} key={user.id}>
                <div>
                  {user.firstName} {user.lastName}
                </div>
                <div>{user.email}</div>
                <div>{user.type}</div>
                <div>
                  <a
                    href={`/admin/users/${user.type.toLocaleLowerCase()}/${
                      user.id
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline-success">V</Button>
                  </a>
                  <Button variant="outline-danger">X</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersContent;

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
