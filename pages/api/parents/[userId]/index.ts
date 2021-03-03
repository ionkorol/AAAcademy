// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { ParentProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  if (req.method === "POST") {
    const { childId, action } = req.body;
    if (childId) {
      try {
        if (action === "add") {
          await firebaseAdmin
            .firestore()
            .collection("users")
            .doc(userId as string)
            .update({
              children: firebaseAdmin.firestore.FieldValue.arrayUnion(childId),
            });
          res.statusCode = 200;
          res.json({ status: true });
        } else {
          await firebaseAdmin
            .firestore()
            .collection("users")
            .doc(userId as string)
            .update({
              children: firebaseAdmin.firestore.FieldValue.arrayRemove(childId),
            });
          res.statusCode = 200;
          res.json({ status: true });
        }
      } catch (error) {
        res.statusCode = 200;
        res.json({
          status: false,
          error: error.message,
        });
      }
    }
  } else if (req.method === "PATCH") {
    const userData = req.body as ParentProp;

    try {
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(userId as string)
        .set({ ...userData }, { merge: true });
      res.statusCode = 200;
      res.json({ status: true });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const data = (
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(userId as string)
          .get()
      ).data() as ParentProp;

      const students = (
        await (
          await fetch(`${process.env.SERVER}/api/parents/${userId}/students`)
        ).json()
      ).data;
      res.statusCode = 200;
      res.json({ status: true, data: { ...data, students } });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }
  } else if (req.method === "DELETE") {
    const resError = {
      auth: null,
      firestore: null,
    };
    try {
      await firebaseAdmin.auth().deleteUser(userId as string);
    } catch (error) {
      resError.auth = error.message;
    }
    try {
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(userId as string)
        .delete();
    } catch (error) {
      resError.firestore = error.message;
    }

    if (resError.auth && resError.firestore) {
      res.statusCode = 200;
      res.json({
        status: false,
        error: `${resError.auth}/${resError.firestore}`,
      });
    } else {
      res.statusCode = 200;
      res.json({ status: true });
    }
  } else {
    res.statusCode = 200;
    res.json({ status: false, error: "Method Not Allowed!" });
  }
};
