import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const { id } = req.query;
    try {
      const invoicesQuery = await firebaseAdmin
        .firestore()
        .collection("invoices")
        .get();

      const invoicesData = invoicesQuery.docs.map((invoice) => invoice.data());
      res.statusCode = 200;
      res.json({
        status: true,
        data: invoicesData,
      });
    } catch (error) {
      res.statusCode = 200;
      res.json({
        status: false,
        error: error.message,
      });
    }
  } else {
    res.statusCode = 200;
    res.json({
      status: false,
      error: "Method Not Allowed",
    });
  }
};
