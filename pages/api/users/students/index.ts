import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { StudentProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Add User
  if (req.method === "POST") {
    const {
      firstName,
      lastName,
      dob,
      email,
      phone,
      clubs,
      parentId,
    } = req.body as StudentProp;
    let user: firebaseAdmin.auth.UserRecord;
    try {
      try {
        user = await firebaseAdmin.auth().createUser({
          email: `${firstName}${lastName}@alwaysactive.academy`,
          emailVerified: false,
          password: `${firstName}${lastName}`,
          displayName: `${firstName} ${lastName}`,
        });
      } catch (error) {
        user = await firebaseAdmin.auth().createUser({
          email: `${firstName}${lastName}1@alwaysactive.academy`,
          emailVerified: false,
          password: `${firstName}${lastName}`,
          displayName: `${firstName} ${lastName}`,
        });
      }
      const writeResult = await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set(
          {
            firstName,
            lastName,
            email,
            phone,
            dob,
            type: "Student",
            id: user.uid,
            parentId,
          } as StudentProp,
          { merge: true }
        );
      res.statusCode = 200;
      res.json({
        status: true,
        data: {
          email: user.email,
          id: user.uid,
        },
      });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }

    // Get Users
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
