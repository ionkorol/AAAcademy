import { AdminLayout } from "components/admin";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

import nookies from "nookies";
import { ApiResProp, ClubProp, StudentProp } from "utils/interfaces";
import firebaseAdmin from "utils/firebaseAdmin";
import { GetServerSideProps } from "next";

interface Props {
  data: StudentProp;
}

const Student: React.FC<Props> = (props) => {
  const { data } = props;

  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    setClubs([]);
    data.clubs.forEach((club) => {
      fetch(`/api/clubs/${club.id}`)
        .then((res) => res.json())
        .then((data) =>
          setClubs((prevState) => [...prevState, { ...data.data }])
        );
    });
  }, [data.clubs]);

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
          {clubs.map((club) => (
            <tr key={club.id}>
              <td>{club.title}</td>
              <td>
                {club.time.from} - {club.time.to}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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
