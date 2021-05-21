import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { ClubProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { clubId } = req.query;

  if (req.method === "GET") {
    try {
      const clubData = (
        await firebaseAdmin
          .firestore()
          .collection("clubs")
          .doc(clubId as string)
          .get()
      ).data();

      const calendarData = await (
        await fetch(
          `${process.env.SERVER}/api/clubs/${clubId as string}/calendar`
        )
      ).json();
      res.status(200).json({
        ...clubData,
        calendar: calendarData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  } else if (req.method === "DELETE") {
    try {
      await firebaseAdmin
        .firestore()
        .collection("clubs")
        .doc(clubId as string)
        .delete();
      res.status(200).end();
    } catch (error) {
      res.status(500).json(error);
    }
  } else if (req.method === "PATCH") {
    const clubData: ClubProp = req.body;
    try {
      await firebaseAdmin
        .firestore()
        .collection("clubs")
        .doc(clubId as string)
        .set({ ...clubData }, { merge: true });
      res.status(200).end();
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json({ message: "Method Not Allowed" });
  }
};
