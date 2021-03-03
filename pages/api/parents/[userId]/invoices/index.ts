// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { getNextWeekDayDate, getRemainingWeeks } from "utils/functions";
import { ClubProp, InvoiceProp, ParentProp } from "utils/interfaces";
import { daysNames, monthsNames } from "utils/variables";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  if (req.method === "POST") {
    try {
      const parentData = (
        await (
          await fetch(`${process.env.SERVER}/api/parents/${userId}`)
        ).json()
      ).data as ParentProp;

      const invoiceData = {
        subTotal: 0,
        discount: 0,
        lineItems: [],
      } as InvoiceProp;

      // Calculate invoice id
      invoiceData.id =
        (
          await firebaseAdmin
            .firestore()
            .collection("invoices")
            .orderBy("id", "asc")
            .limitToLast(1)
            .get()
        ).docs[0].data().id + 1;

      // Assign parentId
      invoiceData.parentId = userId as string;

      // Calculate invoice dates
      const invoiceDate = new Date();
      const dueDate = getNextWeekDayDate(5);

      invoiceData.invoiceDate = {
        day: invoiceDate.getDate(),
        dayName: daysNames[invoiceDate.getDay()],
        month: invoiceDate.getMonth(),
        monthName: monthsNames[invoiceDate.getMonth()],
        year: invoiceDate.getFullYear(),
      };

      invoiceData.dueDate = {
        day: dueDate.getDate(),
        dayName: daysNames[dueDate.getDay()],
        month: dueDate.getMonth(),
        monthName: monthsNames[dueDate.getMonth()],
        year: dueDate.getFullYear(),
      };

      // Build lineItems object
      const remainingWeeks = getRemainingWeeks();

      for (const student of parentData.students) {
        for (const club of student.clubs) {
          if (club.quantity === 0) {
            const clubData = (
              await firebaseAdmin
                .firestore()
                .collection("clubs")
                .doc(club.id)
                .get()
            ).data() as ClubProp;
            invoiceData.lineItems.push({
              student,
              club: clubData,
              quantity: remainingWeeks,
            });
            // Calculate subTotal
            invoiceData.subTotal += clubData.price * remainingWeeks;
            clubData.fees.forEach((fee) => (invoiceData.subTotal += fee.price));

            // Calculate discount
            if (parentData.hasDiscount) {
              invoiceData.discount += clubData.price * remainingWeeks;
            }
          }
        }
      }

      // Assign paid
      invoiceData.paid = false;

      // Assign registration fee
      invoiceData.registrationFee = parentData.paidRegistration
        ? 0
        : Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE);

      // Assign transactions
      invoiceData.transactions = [];
      if (invoiceData.subTotal) {
        await firebaseAdmin
          .firestore()
          .collection("invoices")
          .doc(String(invoiceData.id))
          .set(invoiceData);
        res.statusCode = 200;
        res.json({ status: true, data: invoiceData });
      } else {
        res.statusCode = 200;
        res.json({ status: true });
      }
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
