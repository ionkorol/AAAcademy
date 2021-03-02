// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { StudentProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { studentId, userId } = req.query;
  if (req.method === "PATCH") {
    // Update student data
    const studentData = req.body as StudentProp;
    try {
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(studentId as string)
        .set({ ...studentData }, { merge: true });
      res.statusCode = 200;
      res.json({ status: true });
    } catch (error) {
      res.statusCode = 200;
      res.json({
        status: false,
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
    // Get student data
    try {
      const data = (
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(userId as string)
          .collection("students")
          .doc(studentId as string)
          .get()
      ).data() as StudentProp;

      const clubsData = (
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(userId as string)
          .collection("students")
          .doc(studentId as string)
          .collection("clubs")
          .get()
      ).docs.map((club) => club.data());
      res.statusCode = 200;
      res.json({ status: true, data: { ...data, clubs: clubsData } });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }
  } else if (req.method === "DELETE") {
    // Delete student
    try {
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(userId as string)
        .collection("students")
        .doc(studentId as string)
        .delete();
      res.statusCode = 200;
      res.json({ status: true });
    } catch (error) {
      res.statusCode = 200;
      res.json({
        status: false,
        error: error.message,
      });
    }
  } else {
    res.statusCode = 200;
    res.json({ status: false, error: "Method Not Allowed!" });
  }
};
