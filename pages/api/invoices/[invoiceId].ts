import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { getRemainingWeeks } from "utils/functions";
import { InvoiceProp, ParentProp } from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { invoiceId } = req.query;

  // Invoice pay
  if (req.method === "PATCH") {
    const { gateway, id, date, total } = req.body;

    const fDate = new Date(date);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    try {
      const invoiceData = (
        await firebaseAdmin
          .firestore()
          .collection("invoices")
          .doc(invoiceId as string)
          .get()
      ).data() as InvoiceProp;

      // const userData = (
      //   await firebaseAdmin
      //     .firestore()
      //     .collection("users")
      //     .doc(invoiceData.parentId)
      //     .get()
      // ).data() as ParentProp;

      // Update the invoice
      await firebaseAdmin
        .firestore()
        .collection("invoices")
        .doc(invoiceId as string)
        .update({
          paid: true,
          transactions: firebaseAdmin.firestore.FieldValue.arrayUnion({
            date: {
              day: fDate.getDate(),
              dayName: days[fDate.getDay()],
              month: fDate.getMonth() + 1,
              monthName: fDate.getMonth(),
              year: fDate.getFullYear(),
            },
            gateway,
            total,
            id,
          }),
        });

      // Update Account Ballance
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(invoiceData.parentId)
        .update({
          "funds.amount": 0,
        });

      // Add classes to kids
      for (const item of invoiceData.lineItems) {
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(item.child.id)
          .collection("clubs")
          .doc(item.club.id)
          .update({
            quantity: firebaseAdmin.firestore.FieldValue.increment(
              getRemainingWeeks()
            ),
          });
      }

      res.statusCode = 200;
      res.json({
        status: true,
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
