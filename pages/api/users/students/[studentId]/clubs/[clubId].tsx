// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { StudentProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { clubId, studentId } = req.query;
  if (req.method === "POST") {
    try {
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(studentId as string)
        .update({
          clubs: firebaseAdmin.firestore.FieldValue.arrayUnion(clubId),
        });
      res.statusCode = 200;
      res.json({ status: true });
    } catch (error) {
      res.statusCode = 200;
      res.json({
        status: false,
        error: error.message,
      });
    }
  } else if (req.method === "DELETE") {
    try {
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(studentId as string)
        .update({
          clubs: firebaseAdmin.firestore.FieldValue.arrayRemove(clubId),
        });
      res.statusCode = 200;
      res.json({ status: true });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }
  } else {
    res.statusCode = 200;
    res.json({ status: false, error: "Method Not Allowed!" });
  }
};
