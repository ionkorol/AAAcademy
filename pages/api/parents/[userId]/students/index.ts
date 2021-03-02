import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { StudentProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;

  if (req.method === "POST") {
    // Add student to parent
    const { firstName, lastName, dob, phone } = {
      ...req.body,
    } as StudentProp;
    try {
      const docRef = await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(userId as string)
        .collection("students")
        .add({
          firstName,
          lastName,
          phone,
          dob,
        } as StudentProp);

      await docRef.update({ id: docRef.id });

      res.statusCode = 200;
      res.json({
        status: true,
      });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }
  } else if (req.method === "GET") {
    // Get All Students
    try {
      const studentsQuery = await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(userId as string)
        .collection("students")
        .get();
      const studentsData = [];
      for (const doc of studentsQuery.docs) {
        const studentData = doc.data() as StudentProp;
        const clubsQuery = await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(userId as string)
          .collection("students")
          .doc(doc.id)
          .collection("clubs")
          .get();
        const clubsData = clubsQuery.docs.map((clubSnap) => clubSnap.data());
        studentsData.push({
          ...studentData,
          clubs: clubsData,
        });
      }
      res.statusCode = 200;
      res.json({ status: true, data: studentsData });
    } catch (error) {
      res.statusCode = 500;
      res.json({ status: false, error: error.message });
    }

    // Delete User
  } else {
    res.statusCode = 200;
    res.json({ status: false, error: "Method Not Allowed" });
  }
};
