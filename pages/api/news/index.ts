import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const postsSnap = await firebaseAdmin
        .firestore()
        .collection("posts")
        .get();

      const postsData = postsSnap.docs.map((postSnap) => postSnap.data());
      res.statusCode = 200;
      res.json({ status: true, data: postsData });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }
  } else {
    res.statusCode = 200;
    res.json({ status: false, error: "Method Not Allowed" });
  }
};
