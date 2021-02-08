// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { InvoiceProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, invoiceId } = req.query;
  if (req.method === "GET") {
    try {
      const data = (
        await firebaseAdmin
          .firestore()
          .collection("invoices")
          .doc(invoiceId as string)
          .get()
      ).data() as InvoiceProp;

      if (data.parentId !== userId) {
        res.statusCode = 200;
        res.json({ status: false, error: "Not Allowed!" });
      } else {
        res.statusCode = 200;
        res.json({ status: true, data });
      }
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }
  } else {
    res.statusCode = 200;
    res.json({ status: false, error: "Method Not Allowed!" });
  }
};
