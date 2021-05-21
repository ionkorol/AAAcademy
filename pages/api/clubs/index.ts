import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { ClubProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // Add Club
    const clubData: ClubProp = req.body;
    try {
      const docRef = await firebaseAdmin
        .firestore()
        .collection("clubs")
        .add({ ...clubData });

      await docRef.update({
        id: docRef.id,
      });

      res.status(200).json({ id: docRef.id });
    } catch (error) {
      res.status(500).json(error);
    }
  } else if (req.method === "GET") {
    // Get Clubs
    try {
      const clubsQuery = await firebaseAdmin
        .firestore()
        .collection("clubs")
        .get();
      const data = clubsQuery.docs.map((club) => club.data());
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }
};
