import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { UserProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Add User
  if (req.method === "POST") {
    const userData = req.body as UserProp;
    let user;
    try {
      try {
        user = await firebaseAdmin.auth().createUser({
          email: `${userData.firstName}${userData.lastName}@alwaysactive.academy`,
          emailVerified: false,
          password: process.env.DEFAULT_USER_PASSWORD,
          displayName: `${userData.firstName} ${userData.lastName}`,
        });
      } catch (error) {
        user = await firebaseAdmin.auth().createUser({
          email: `${userData.firstName}${userData.lastName}1@alwaysactive.academy`,
          emailVerified: false,
          password: process.env.DEFAULT_USER_PASSWORD,
          displayName: `${userData.firstName} ${userData.lastName}`,
        });
      }
      const writeResult = await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set(
          {
            ...userData,
            id: user.uid,
          },
          { merge: true }
        );
      res.statusCode = 200;
      res.json({
        status: true,
        data: {
          ...userData,
          id: user.uid,
        },
      });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error });
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
      res.json({ status: false, error });
    }

    // Delete User
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    try {
      await firebaseAdmin.auth().deleteUser(id);
      await firebaseAdmin.firestore().collection("users").doc(id).delete();
      res.statusCode = 200;
      res.json({ status: true });
    } catch (error) {
      res.statusCode = 200;
      res.json({
        status: false,
        error,
      });
    }
  } else if (req.method === "PATCH") {
    const userData = req.body as UserProp;

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
      res.json({ status: false, error });
    }
  }
};
