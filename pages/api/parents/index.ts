import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Register User
  if (req.method === "POST") {
    const data = req.body;
    let user: firebaseAdmin.auth.UserRecord;
    try {
      // Register parent auth
      try {
        user = await firebaseAdmin.auth().createUser({
          email: data.email,
          emailVerified: false,
          password: data.password,
          displayName: `${data.firstName} ${data.lastName}`,
        });
      } catch (error) {
        res.statusCode = 200;
        res.json({ status: false, error: error.message });
      }
      delete data.password;

      // Save data to firestore
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set(
          {
            ...data,
            id: user.uid,
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
