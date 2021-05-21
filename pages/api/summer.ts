import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const data = { ...req.body };
    const docRef = await firebaseAdmin
      .firestore()
      .collection("summer")
      .add({ ...data });

    res.status(200).json({ id: docRef.id });
  } else {
    res.status(405).send("Not Allowed");
  }
};
