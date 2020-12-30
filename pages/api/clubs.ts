import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "../../utils/firebaseAdmin";
import { ClubProp } from "../../utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Add Club
  if (req.method === "POST") {
    const clubData: ClubProp = req.body;
    try {
      const write = await firebaseAdmin
        .firestore()
        .collection("clubs")
        .doc(clubData.title)
        .set(clubData);
      res.statusCode = 200;
      res.json(write);
    } catch (error) {
      res.statusCode = 500;
      res.json({ error });
    }
  } else if (req.method === "DELETE") {
    const { title } = req.body;
    try {
      const write = await firebaseAdmin
        .firestore()
        .collection("clubs")
        .doc(title)
        .delete();
      res.statusCode = 200;
      res.json(write);
    } catch (error) {
      res.statusCode = 500;
      res.json({ error });
    }
  } else if (req.method === "PATCH") {
    const clubData: ClubProp = req.body;
    try {
      const write = await firebaseAdmin
        .firestore()
        .collection("clubs")
        .doc(clubData.title)
        .set(clubData, { merge: true });
      res.statusCode = 200;
      res.json(write);
    } catch (error) {
      res.statusCode = 500;
      res.json({ error });
    }
  }
};
