import { AdminLayout } from "components/admin";
import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";

import nookies from "nookies";
import { ApiResProp, ClubProp, StudentProp } from "utils/interfaces";
import firebaseAdmin from "utils/firebaseAdmin";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

interface Props {
  data: StudentProp;
}

const Student: React.FC<Props> = (props) => {
  const { data } = props;

  const [clubs, setClubs] = useState([]);
  const [allClubs, setAllClubs] = useState([]);
  const [addClub, setAddClub] = useState("");

  const router = useRouter();

  const { parentId, studentId } = router.query;

  useEffect(() => {
    setClubs([]);
    data.clubs.forEach((club) => {
      fetch(`/api/clubs/${club.id}`)
        .then((res) => res.json())
        .then((data) =>
          setClubs((prevState) => [...prevState, { ...data.data }])
        );
    })
  }, [data.clubs]);

  // Fetch All Clubs
  useEffect(() => {
    fetch("/api/clubs")
      .then((res) => res.json())
      .then((data) => setAllClubs(data.data));
  }, []);

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

  return (
    <AdminLayout>
      <h2>
        {data.firstName} {data.lastName} - Clubs
      </h2>
      <hr></hr>
      <Table bordered hover striped>
        <thead>
          <tr>
            <th>Title</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {clubs.length ? (
            clubs.map((club) => (
              <tr key={club.id}>
                <td>{club.title}</td>
                <td>
                  {club.time.from} - {club.time.to}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No Clubs on Record</td>
            </tr>
          )}
        </tbody>
      </Table>
      <div>
        <Form onSubmit={handleAddClub}>
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
          <Button type="submit" className="w-100 mt-2">
            Add Club
          </Button>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default Student;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  const { parentId, studentId } = ctx.query;
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const jsonData = (await (
      await fetch(
        `${process.env.SERVER}/api/parents/${parentId}/students/${studentId}`
      )
    ).json()) as ApiResProp;
    if (jsonData.status) {
      return {
        props: {
          data: jsonData.data,
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
