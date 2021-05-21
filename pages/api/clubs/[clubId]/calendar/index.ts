import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { clubId } = req.query;

  if (req.method === "GET") {
    // Get Calendar Items
    try {
      const calendarQuery = await firebaseAdmin
        .firestore()
        .collection("clubs")
        .doc(clubId as string)
        .collection("calendar")
        .get();
      const data = calendarQuery.docs.map((item) => item.data());
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json({ message: "Method Not Allowed" });
  }
};
