import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { ClubProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const clubId = req.query.pid;

  if (req.method === "GET") {
    try {
      const clubSnap = await firebaseAdmin
        .firestore()
        .collection("clubs")
        .doc(clubId as string)
        .get();

      const clubData = clubSnap.data();

      if (!clubData) {
        res.statusCode = 200;
        res.json({ status: false, message: "Not Available" });
      } else {
        res.statusCode = 200;
        res.json({ status: true, data: clubData });
      }
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, message: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      await firebaseAdmin
        .firestore()
        .collection("clubs")
        .doc(clubId as string)
        .delete();
      res.statusCode = 200;
      res.json({ status: true });
    } catch (error) {
      res.statusCode = 500;
      res.json({ status: false, error: error.message });
    }
  } else if (req.method === "PATCH") {
    const clubData: ClubProp = req.body;
    try {
      const write = await firebaseAdmin
        .firestore()
        .collection("clubs")
        .doc(clubId as string)
        .set({ ...clubData }, { merge: true });
      res.statusCode = 200;
      res.json({ status: true });
    } catch (error) {
      res.statusCode = 500;
      res.json({ status: false, error: error.message });
    }
  } else {
    res.statusCode = 200;
    res.json({ status: false, message: "Not Allowed" });
  }
};
