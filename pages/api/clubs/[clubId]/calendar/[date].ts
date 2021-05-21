import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { clubId, date } = req.query;

  if (req.method === "POST") {
    // Add student to calendar item
    const { studentId } = req.body;
    try {
      await firebaseAdmin
        .firestore()
        .collection("clubs")
        .doc(clubId as string)
        .collection("calendar")
        .doc(date as string)
        .update({
          students: firebaseAdmin.firestore.FieldValue.arrayUnion(studentId),
        });
      res.status(200).end();
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json({ message: "Method Not Allowed" });
  }
};
