// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { FeeProp, InvoiceProp, UserProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  if (req.method === "POST") {
    const lineItems = req.body as {
      name: string;
      price: number;
      discount: number;
      fees: FeeProp[];
    }[];

    let total = 0;
    lineItems.forEach((item) => {
      total += item.price;
      total -= item.discount;
      item.fees.forEach((fee) => {
        total += fee.price;
      });
    });

    try {
      const lastId = (
        await firebaseAdmin
          .firestore()
          .collection("invoices")
          .orderBy("id", "asc")
          .limitToLast(1)
          .get()
      ).docs[0].data().id;
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const invoiceDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(invoiceDate.getDate() + 7);
      await firebaseAdmin
        .firestore()
        .collection("invoices")
        .doc(String(lastId + 1))
        .set({
          id: lastId + 1,
          parentId: userId,
          invoiceDate: {
            day: invoiceDate.getDate(),
            month: invoiceDate.getMonth(),
            year: invoiceDate.getFullYear(),
            dayName: days[invoiceDate.getDay()],
          },
          dueDate: {
            day: invoiceDate.getDate(),
            month: invoiceDate.getMonth(),
            year: invoiceDate.getFullYear(),
            dayName: days[invoiceDate.getDay()],
          },
          total,
          lineItems,
        } as InvoiceProp);

      res.statusCode = 200;
      res.json({ status: true });
    } catch (error) {
      res.statusCode = 200;
      res.json({
        status: false,
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
    try {
      const data = (
        await firebaseAdmin
          .firestore()
          .collection("invoices")
          .where("parentId", "==", userId as string)
          .get()
      ).docs.map((doc) => doc.data());

      res.statusCode = 200;
      res.json({ status: true, data });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }
  } else {
    res.statusCode = 200;
    res.json({ status: false, error: "Method Not Allowed!" });
  }
};
