// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { getRemainingWeeks } from "utils/functions";
import {
  ApiResProp,
  ClubProp,
  InvoiceProp,
  ParentProp,
} from "utils/interfaces";
import { daysNames, monthsNames } from "utils/variables";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, invoiceId } = req.query;

  if (req.method === "GET") {
    // Get Invoice data
    try {
      let invoiceData = (
        await firebaseAdmin
          .firestore()
          .collection("invoices")
          .doc(invoiceId as string)
          .get()
      ).data() as InvoiceProp;

      if (!invoiceData.paid) {
        const invoiceUpdateJson = (await (
          await fetch(
            `${process.env.SERVER}/api/parents/${userId}/invoices/${invoiceId}`,
            { method: "PATCH" }
          )
        ).json()) as ApiResProp;
        if (!invoiceUpdateJson.status) {
          res.statusCode = 200;
          res.json({ status: false, error: invoiceUpdateJson.error });
        } else {
          invoiceData = invoiceUpdateJson.data;
        }
      }

      res.statusCode = 200;
      res.json({ status: true, data: invoiceData });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }
  } else if (req.method === "PATCH") {
    // Update invoice
    try {
      const invoiceData = (
        await firebaseAdmin
          .firestore()
          .collection("invoices")
          .doc(invoiceId as string)
          .get()
      ).data() as InvoiceProp;

      const parentData = (
        await (
          await fetch(`${process.env.SERVER}/api/parents/${userId}`)
        ).json()
      ).data as ParentProp;

      // Build lineItems object
      invoiceData.lineItems = [];
      invoiceData.subTotal = 0;
      invoiceData.discount = 0;
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
              invoiceData.discount += (clubData.price * remainingWeeks) / 2;
            }
          }
        }
      }

      // Assign registration fee
      invoiceData.registrationFee = parentData.paidRegistration
        ? 0
        : Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE);

      await firebaseAdmin
        .firestore()
        .collection("invoices")
        .doc(invoiceId as string)
        .set(invoiceData, { merge: true });
      res.statusCode = 200;
      res.json({ status: true, data: invoiceData });
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
    }
  } else if (req.method === "POST") {
    // Mark invoice as paid
    const { gateway, id, date, total } = req.body;
    const fDate = new Date(date);
    try {
      const invoiceData = (
        await firebaseAdmin
          .firestore()
          .collection("invoices")
          .doc(invoiceId as string)
          .get()
      ).data() as InvoiceProp;

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
              dayName: daysNames[fDate.getDay()],
              month: fDate.getMonth() + 1,
              monthName: monthsNames[fDate.getMonth()],
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

      // Handle registration fee
      if (invoiceData.registrationFee) {
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(userId as string)
          .update({
            paidRegistration: true,
          } as ParentProp);
      }

      // Add classes to kids
      const remainingWeeks = getRemainingWeeks();
      for (const item of invoiceData.lineItems) {
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(invoiceData.parentId)
          .collection("students")
          .doc(item.student.id)
          .collection("clubs")
          .doc(item.club.id)
          .update({
            quantity: firebaseAdmin.firestore.FieldValue.increment(
              remainingWeeks
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
    res.json({ status: false, error: "Method Not Allowed!" });
  }
};
