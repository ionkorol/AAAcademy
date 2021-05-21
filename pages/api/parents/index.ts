import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // Register User
    const data = req.body;
    let user: firebaseAdmin.auth.UserRecord;
    try {
      // Register parent auth
      user = await firebaseAdmin.auth().createUser({
        email: data.email,
        emailVerified: false,
        password: data.password,
        displayName: `${data.firstName} ${data.lastName}`,
      });
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

      res.status(200).json({
        email: user.email,
        id: user.uid,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  } else if (req.method === "GET") {
    // Get Users
    try {
      const usersQuery = await firebaseAdmin
        .firestore()
        .collection("users")
        .get();
      const data = usersQuery.docs.map((userSnap) => userSnap.data());
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }

    // Delete User
  } else {
    res.status(500).json({ message: "Method Not Allowed" });
  }
};
