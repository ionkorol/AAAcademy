import { NextApiRequest, NextApiResponse } from "next";
import { OrderProp } from "utils/interfaces";
import firebaseAdmin from "../../utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const data = req.body as OrderProp;
    const lastId = (
      await firebaseAdmin
        .firestore()
        .collection("orders")
        .orderBy("id", "asc")
        .limitToLast(1)
        .get()
    ).docs[0].data().id;

    const snap = await firebaseAdmin
      .firestore()
      .collection("orders")
      .doc(String(Number(lastId) + 1))
      .set({ ...data, id: Number(lastId) + 1 });

    res.statusCode = 200;
    res.json({
      status: true,
      data: snap,
    });
  } else {
    res.statusCode = 200;
    res.json({
      status: false,
      error: "Method Not Allowed",
    });
  }
};
