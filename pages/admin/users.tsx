import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { Alert, Table, Toast } from "react-bootstrap";
import { useRouter } from "next/router";
import firebase from "../../utils/firebase";
import styles from "./Users.module.scss";
import firebaseAdmin from "../../utils/firebaseAdmin";
import { UserProp } from "../../utils/interfaces";
import { AddUserModal, AdminLayout, EditUserModal } from "../../components";

interface UsersProps {
  usersData?: UserProp[];
}
const UsersContent: React.FC<UsersProps> = (props) => {
  const { usersData } = props;

  const [currentUsers, setCurrentUsers] = useState<UserProp[]>(usersData);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showUserCreated, setShowUserCreated] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProp>(usersData[0]);

  const [error, setError] = useState(null);

  const router = useRouter();

  // Real Time Updates
  useEffect(() => {
    const usnsub = firebase
      .firestore()
      .collection("users")
      .onSnapshot((data) => {
        setCurrentUsers(data.docs.map((doc) => doc.data() as UserProp));
      });

    return () => usnsub();
  }, []);

  const handleEdit = (userData: UserProp) => {
    setSelectedUser(userData);
    setShowEditUser(true);
  };

  const deleteUser = async (userData: UserProp) => {
    try {
      await firebase.firestore().collection("users").doc(userData.id).delete();
    } catch (error) {
      setError(error.message);
    }
  };

  const onSuccess = () => {
    router.push("/admin/users", undefined, { shallow: true });
  };

  return (
    <AdminLayout>
      <div className={styles.container}>
        <h2>Users</h2>
        {error ? <Alert variant="danger"></Alert> : null}
        <div className={styles.controls}>
          <div className={styles.filter}></div>
          <div className={styles.actions}>
            <button onClick={() => setShowAddUser(true)}>Add</button>
          </div>
        </div>
        <Table bordered hover striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.email}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.type}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>V</button>
                  <button
                    style={{ backgroundColor: "#ec7849" }}
                    onClick={() => deleteUser(user)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <AddUserModal
        show={showAddUser}
        handleClose={() => setShowAddUser(false)}
      />
      <EditUserModal
        show={showEditUser}
        handleClose={() => setShowEditUser(false)}
        userData={selectedUser}
      />
    </AdminLayout>
  );
};

export default UsersContent;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const usersQuery = await firebaseAdmin
      .firestore()
      .collection("users")
      .get();
    const usersData = usersQuery.docs.map((userSnap) => userSnap.data());

    return {
      props: {
        usersData,
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
