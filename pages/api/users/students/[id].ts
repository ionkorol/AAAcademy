// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { UserProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (req.method === "POST") {
    const { childId } = req.body;
    if (childId) {
      try {
        const write = await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(id as string)
          .update({
            children: firebaseAdmin.firestore.FieldValue.arrayUnion(childId),
          });
        res.statusCode = 200;
        res.json({ status: true, data: write });
      } catch (error) {
        res.statusCode = 200;
        res.json({
          status: false,
          error: error.message,
        });
      }
    }
  } else if (req.method === "GET") {
    try {
      const data = (
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(id as string)
          .get()
      ).data() as UserProp;
      res.statusCode = 200;
      res.json({ status: true, data });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }
  } else if (req.method === "DELETE") {
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
