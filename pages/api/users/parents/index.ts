import { faSleigh } from "@fortawesome/free-solid-svg-icons";
import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { UserProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Add User
  if (req.method === "POST") {
    const {
      firstName,
      lastName,
      email,
      phone,
      type,
      emergencyContact,
      address,
      children,
      password,
    } = req.body as UserProp;
    let user: firebaseAdmin.auth.UserRecord;
    try {
      try {
        user = await firebaseAdmin.auth().createUser({
          email: email,
          emailVerified: false,
          password: password,
          displayName: `${firstName} ${lastName}`,
        });
      } catch (error) {
        res.statusCode = 200;
        res.json({ status: false, error: error.message });
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
            type,
            emergencyContact,
            address,
            id: user.uid,
            children,
          },
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
  } else {
    res.statusCode = 200;
    res.json({ status: false, error: "Method Not Allowed" });
  }
};
