import { AccountLayout, Schedule } from "components/account";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import firebaseAdmin from "utils/firebaseAdmin";
import nookies from "nookies";
import { ApiResProp, ClubProp, StudentProp } from "utils/interfaces";

import styles from "./Child.module.scss";
import { useRouter } from "next/router";
import { Button, Form, ListGroup, ListGroupItem, Table } from "react-bootstrap";
import { getAge } from "utils/functions";
import Link from "next/link";

interface Props {
  data: StudentProp;
  parentId: string;
}

const Student: React.FC<Props> = (props) => {
  const { data, parentId } = props;

  const [error, setError] = useState(null);
  const [clubs, setClubs] = useState<{ data: ClubProp; quantity: number }[]>(
    []
  );
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
    setClubs([]);
    data.clubs.forEach((club) => {
      fetch(`/api/clubs/${club.id}`)
        .then((res) => res.json())
        .then((data: ApiResProp) => {
          if (data.status) {
            setClubs((prevState) => [
              ...prevState,
              {
                data: data.data,
                quantity: club.quantity,
              },
            ]);
          } else {
            setError(data.error);
          }
        });
    });
  }, []);

  const deleteChild = async () => {
    const childData = (await (
      await fetch(`/api/parents/${parentId}/students/${data.id}`, {
        method: "DELETE",
      })
    ).json()) as ApiResProp;

    if (childData.status) {
      router.push("/account/students");
    } else {
      setError(childData.error);
    }
  };

  const handleAddClub = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const jsonData = (await (
      await fetch(
        `/api/parents/${parentId}/students/${data.id}/clubs/${addClub}`,
        {
          method: "POST",
        }
      )
    ).json()) as ApiResProp;

    if (jsonData.status) {
      alert("Club Added");
      router.reload();
    } else {
      alert(jsonData.error);
    }
  };

  const handleRemoveClub = async (club: { id: string; quantity: number }) => {
    const jsonData = (await (
      await fetch(
        `/api/parents/${parentId}/students/${data.id}/clubs/${club.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(club),
        }
      )
    ).json()) as ApiResProp;

    if (jsonData.status) {
      alert("Club Removed");
      router.reload();
    } else {
      alert(jsonData.error);
    }
  };

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
              <span>
                {data.dob} - {getAge(data.dob)} Years old
              </span>
            </div>
            <div>
              <span className={styles.key}>Phone:</span>
              <span>{data.phone}</span>
            </div>
          </div>
          <Link href={`/account/students/${data.id}/edit`}>
            <button>Edit</button>
          </Link>
        </div>
        <div className={styles.clubs}>
          <h3>Clubs</h3>
          <hr></hr>
          <ListGroup variant="flush">
            {clubs.map((club) => (
              <ListGroupItem
                className="bg-transparent text-dark d-flex justify-content-between align-items-center font-weight-bold"
                key={club.data.id}
              >
                <span>
                  {club.data.title} ({club.data.time.from}:00 -{" "}
                  {club.data.time.to}:00) ({club.quantity} classes left)
                </span>
                <Button
                  variant="outline-danger"
                  onClick={() =>
                    handleRemoveClub({
                      id: club.data.id,
                      quantity: club.quantity,
                    })
                  }
                >
                  x
                </Button>
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
                  <option disabled={club.isFull} value={club.id} key={club.id}>
                    {club.title} ({club.time.from}:00 - {club.time.to}:00) (
                    {club.age.from} - {club.age.to} Years){" "}
                    {club.isFull ? "(Class is Full)" : null}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button type="submit  " variant="warning" className="w-100">
              Add Club
            </Button>
          </Form>
        </div>

        <Schedule data={clubs.map((club) => club.data)} />
        <Button variant="outline-danger" onClick={deleteChild}>
          Remove Child
        </Button>
      </div>
    </AccountLayout>
  );
};

export default Student;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  const { id } = ctx.query;
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const jsonData = (await (
      await fetch(`${process.env.SERVER}/api/parents/${uid}/students/${id}`)
    ).json()) as ApiResProp;

    if (jsonData.status) {
      return {
        props: {
          data: jsonData.data,
          parentId: uid,
        },
      };
    } else {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};
