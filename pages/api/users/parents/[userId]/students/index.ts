import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { StudentProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;

  // Add student to parent
  if (req.method === "POST") {
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
          clubs: [],
          parentId: userId,
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
    try {
      const usersQuery = await firebaseAdmin
        .firestore()
        .collection("users")
        .get();
      const usersData = usersQuery.docs.map((userSnap) => userSnap.data());
      res.statusCode = 200;
      res.json({ status: true, data: usersData });
    } catch (error) {
      res.statusCode = 500;
      res.json({ status: false, error: error.message });
    }

    // Delete User
  } else if (req.method === "PATCH") {
    const userData = req.body as StudentProp;

    try {
      const writeResult = await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(userData.id)
        .set(userData, { merge: true });
      res.statusCode = 200;
      res.json({ status: true, data: writeResult });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }
  }
};
