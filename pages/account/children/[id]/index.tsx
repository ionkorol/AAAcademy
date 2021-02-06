import { AccountLayout, Schedule } from "components/account";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";
import { ApiResProp, ClubProp, StudentProp } from "utils/interfaces";

import styles from "./Child.module.scss";
import { useRouter } from "next/router";
import { Button, Form, ListGroup, ListGroupItem, Table } from "react-bootstrap";
import firebaseClient from "utils/firebaseClient";

interface Props {
  data: StudentProp;
  parentId: string;
}

const Child: React.FC<Props> = (props) => {
  const { data, parentId } = props;

  const [error, setError] = useState(null);
  const [clubs, setClubs] = useState<ClubProp[]>([]);
  const [allClubs, setAllClubs] = useState<ClubProp[]>([]);

  const [addClub, setAddClub] = useState("");

  const router = useRouter();

  // Fetch All Clubs
  useEffect(() => {
    fetch("/api/clubs")
      .then((res) => res.json())
      .then((data) => setAllClubs(data.data));
  }, []);

  useEffect(() => {
    const unsub = firebaseClient
      .firestore()
      .collection("users")
      .doc(data.id)
      .onSnapshot((data) => {
        setClubs([]);
        const userData = data.data() as StudentProp;
        userData.clubs.forEach((club) =>
          fetch(`/api/clubs/${club}`)
            .then((res) => res.json())
            .then((data) => setClubs((prevState) => [...prevState, data.data]))
        );
      });

    return () => unsub();
  }, []);

  const deleteChild = async () => {
    const childData = (await (
      await fetch(`/api/users/students/${data.id}`, {
        method: "DELETE",
      })
    ).json()) as ApiResProp;

    if (!childData.status) {
      setError(childData.error);
      return;
    }

    const parentData = await (
      await fetch(`/api/users/parents/${parentId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          childId: data.id,
          action: "remove",
        }),
      })
    ).json();

    if (parentData.status) {
      router.push("/account/children");
    } else {
      setError(parentData.error);
    }
  };

  const handleAddClub = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonData = (await (
      await fetch(`/api/users/students/${data.id}/clubs/${addClub}`, {
        method: "POST",
      })
    ).json()) as ApiResProp;

    if (jsonData.status) {
      alert("Club Added");
    } else {
      alert(jsonData.error);
    }
  };

  console.log(addClub);

  return (
    <AccountLayout>
      <div className={styles.container}>
        <div className={styles.name}>
          <h2>
            {data.firstName} {data.lastName}
          </h2>
        </div>
        <div className={styles.info}>
          <h3>Info</h3>
          <hr></hr>
          <div className={styles.infoBody}>
            <div>
              <span className={styles.key}>Date of Birth:</span>
              <span>{data.dob}</span>
            </div>
            <div>
              <span className={styles.key}>Email:</span>
              <span>{data.email}</span>
            </div>
            <div>
              <span className={styles.key}>Phone:</span>
              <span>{data.phone}</span>
            </div>
          </div>
          <button>Edit</button>
        </div>
        <div className={styles.clubs}>
          <h3>Clubs</h3>
          <hr></hr>
          <ListGroup variant="flush">
            {clubs.map((club) => (
              <ListGroupItem
                className="bg-transparent text-dark d-flex justify-content-between align-items-center font-weight-bold"
                key={club.id}
              >
                <span>
                  {club.title} ({club.time.from}:00 - {club.time.to}:00)
                </span>
                <Button variant="outline-danger">x</Button>
              </ListGroupItem>
            ))}
          </ListGroup>
          <Form onSubmit={handleAddClub}>
            <Form.Group>
              <Form.Control
                as="select"
                onChange={(e) => setAddClub(e.target.value)}
              >
                {allClubs.map((club: ClubProp) => (
                  <option value={club.id} key={club.id}>
                    {club.title} ({club.time.from}:00 - {club.time.to}:00)
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button type="submit  " variant="warning" className="w-100">
              Add Club
            </Button>
          </Form>
        </div>

        <Schedule data={clubs} />
        <Button variant="outline-danger" onClick={deleteChild}>
          Remove Child
        </Button>
      </div>
    </AccountLayout>
  );
};

export default Child;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  const { id } = ctx.query;
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const jsonData = (await (
      await fetch(`${process.env.SERVER}/api/users/students/${id}`)
    ).json()) as ApiResProp;

    if (jsonData.status) {
      return {
        props: {
          data: jsonData.data,
          parentId: uid,
        },
      };
    } else {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
      return {
        props: {} as never,
      };
    }
  } catch (error) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};
