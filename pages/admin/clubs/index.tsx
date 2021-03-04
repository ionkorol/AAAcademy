import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { Alert, Badge, Button, Container, Table } from "react-bootstrap";
import { ApiResProp, ClubProp } from "utils/interfaces";
import { AdminLayout } from "components/admin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faMusic,
  faPalette,
  faVolleyballBall,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import firebaseAdmin from "utils/firebaseAdmin";
import firebaseClient from "utils/firebaseClient";
import nookies from "nookies";

import styles from "./Clubs.module.scss";

interface Props {
  data: ClubProp[];
}
const ClubsContent: React.FC<Props> = (props) => {
  const { data } = props;

  const [error, setError] = useState(null);

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

  const handleFix = async (club: ClubProp) => {
    try {
      await firebaseClient.firestore().collection("clubs").doc(club.id).update({
        fees: [],
      });
      alert("Success");
    } catch (error) {
      alert(error);
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
      <Container>
        {error ? <Alert variant="danger"></Alert> : null}
        <div className={styles.controls}>
          <div className={styles.actions}>
            <a href="/admin/clubs/add" target="_blank" rel="noreferrer">
              <Button variant="success">Add +</Button>
            </a>
          </div>
        </div>
        <Table hover bordered striped>
          <thead>
            <tr>
              <th>Title</th>
              <th>Categories</th>
              <th>Date</th>
              <th>Time</th>
              <th>Age</th>
              <th>Image</th>
              <th>Teacher</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {data.map((club) => (
              <Link href={`/admin/clubs/${club.id}`} key={club.id}>
                <tr style={{ cursor: "pointer" }}>
                  <td>
                    {club.title}
                    <Badge variant={club.isFull ? "danger" : "success"}>
                      AV
                    </Badge>
                  </td>
                  <td>
                    {club.categories.map((category) => (
                      <FontAwesomeIcon
                        icon={categoryIcon[category]}
                        fixedWidth
                        key={category}
                      />
                    ))}
                  </td>
                  <td>{club.date}</td>
                  <td>
                    {club.time.from} - {club.time.to}
                  </td>
                  <td>{`${club.age.from} - ${club.age.to}`}</td>
                  <td>
                    <img
                      src={club.image}
                      alt={club.title}
                      width={25}
                      height={25}
                    />
                  </td>
                  <td>{club.teacher}</td>
                  <td>${club.price.toFixed(2)}</td>
                </tr>
              </Link>
            ))}
          </tbody>
        </Table>
      </Container>
    </AdminLayout>
  );
};

export default ClubsContent;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = nookies.get(ctx);
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const jsonData = (await (
      await fetch(`${process.env.SERVER}/api/clubs`)
    ).json()) as ApiResProp;

    if (jsonData.status) {
      return {
        props: {
          data: jsonData.data,
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
