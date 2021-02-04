import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { StudentProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (req.method === "DELETE") {
    const resError = {
      auth: null,
      firestore: null,
    };
    try {
      await firebaseAdmin.auth().deleteUser(id as string);
    } catch (error) {
      resError.auth = error.message;
    }
    try {
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(id as string)
        .delete();
    } catch (error) {
      resError.firestore = error.message;
    }

    if (resError.auth && resError.firestore) {
      res.statusCode = 200;
      res.json({
        status: false,
        error: `${resError.auth}/${resError.firestore}`,
      });
    } else {
      res.statusCode = 200;
      res.json({ status: true });
    }
  } else {
    res.statusCode = 200;
    res.json({ status: false, error: "Method Not Allowed!" });
  }
};
