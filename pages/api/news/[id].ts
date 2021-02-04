import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (req.method === "GET") {
    try {
      const data = (
        await firebaseAdmin
          .firestore()
          .collection("posts")
          .doc(id as string)
          .get()
      ).data();

      res.statusCode = 200;
      res.json({ status: true, data });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }
  } else {
    res.statusCode = 200;
    res.json({ status: false, error: "Method Not Allowed" });
  }
};
