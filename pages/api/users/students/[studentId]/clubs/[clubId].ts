// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { getAge } from "utils/functions";
import {
  ClubProp,
  InvoiceProp,
  LineItemProp,
  ParentProp,
  StudentProp,
} from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { clubId, studentId } = req.query;

  // Add club to child
  if (req.method === "POST") {
    try {
      // Get student data
      const studentData = (
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(studentId as string)
          .get()
      ).data() as StudentProp;

      const studentClubsData = (
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(studentId as string)
          .collection("clubs")
          .get()
      ).docs.map((doc) => doc.data());

      // Get requested club data
      const requestedClubData = (
        await firebaseAdmin
          .firestore()
          .collection("clubs")
          .doc(clubId as string)
          .get()
      ).data() as ClubProp;

      // Get parent data
      const parentData = (
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(studentData.parentId)
          .get()
      ).data() as ParentProp;

      // Check if student fits age requirement
      // if (
      //   requestedClubData.age.from > getAge(studentData.dob) ||
      //   getAge(studentData.dob) > requestedClubData.age.to
      // ) {
      //   res.statusCode = 200;
      //   res.json({
      //     status: false,
      //     error: "Student doesn't meet age requirement",
      //   });
      //   res.end();
      //   return;
      // }

      // Check if time slot is taken
      let slotTaken = false;
      for (const club of studentClubsData) {
        const clubData = (
          await firebaseAdmin.firestore().collection("clubs").doc(club.id).get()
        ).data() as ClubProp;
        if (clubData && clubData.time.from === requestedClubData.time.from) {
          slotTaken = true;
        }
      }

      if (slotTaken) {
        res.statusCode = 200;
        res.json({ status: false, error: "Time slot is not available" });
        res.end();
        return;
      }

      // Add the club with 0 classes
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(studentId as string)
        .collection("clubs")
        .doc(clubId as string)
        .set({
          id: clubId,
          quantity: 0,
        });

      // Add Club to invoice
      // Check for Existing Invoice
      let invoiceData: InvoiceProp | null = null;
      const unpaidInvoices = (
        await firebaseAdmin
          .firestore()
          .collection("invoices")
          .where("parentId", "==", studentData.parentId)
          .where("paid", "==", false)
          .get()
      ).docs;
      if (unpaidInvoices.length > 0) {
        invoiceData = unpaidInvoices[0].data() as InvoiceProp;
        invoiceData.lineItems.push({
          child: studentData,
          club: requestedClubData,
          quantity: 3,
        } as LineItemProp);
        if (parentData.hasDiscount) {
          invoiceData.total += (requestedClubData.price * 3) / 2;
          invoiceData.discount += (requestedClubData.price * 3) / 2;
        } else {
          invoiceData.total += requestedClubData.price * 3;
        }
      } else {
        const invoiceDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(invoiceDate.getDate() + 7);

        // Figure the current Id
        const currentId =
          (
            await firebaseAdmin
              .firestore()
              .collection("invoices")
              .orderBy("id", "asc")
              .limitToLast(1)
              .get()
          ).docs[0].data().id + 1;

        // Create invoice object
        const userId = parentData.id;
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        invoiceData = {
          id: currentId,
          parentId: userId,
          invoiceDate: {
            day: invoiceDate.getDate(),
            month: invoiceDate.getMonth(),
            year: invoiceDate.getFullYear(),
            dayName: days[invoiceDate.getDay()],
          },
          dueDate: {
            day: dueDate.getDate(),
            month: dueDate.getMonth(),
            year: dueDate.getFullYear(),
            dayName: days[dueDate.getDay()],
          },
          total: parentData.hasDiscount
            ? (requestedClubData.price * 3) / 2
            : requestedClubData.price * 3,
          lineItems: [
            {
              club: requestedClubData,
              child: studentData,
              quantity: 3,
            },
          ],
          discount: parentData.hasDiscount
            ? (requestedClubData.price * 3) / 2
            : 0,
          paid: false,
          registrationFee: !parentData.paidRegistration,
          transactions: [],
        } as InvoiceProp;
      }
      await firebaseAdmin
        .firestore()
        .collection("invoices")
        .doc(String(invoiceData.id))
        .set(invoiceData, { merge: true });

      res.statusCode = 200;
      res.json({ status: true });
      res.end();
      return;
    } catch (error) {
      res.statusCode = 200;
      res.json({
        status: false,
        error: error.message,
      });
      res.end();
      return;
    }
  } else if (req.method === "DELETE") {
    const club = req.body as { id: string; quantity: number };
    try {
      // Get Student Data
      const studentData = (
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(studentId as string)
          .get()
      ).data() as StudentProp;

      const clubData = (
        await firebaseAdmin
          .firestore()
          .collection("clubs")
          .doc(clubId as string)
          .get()
      ).data() as ClubProp;

      const parentData = (
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(studentData.parentId)
          .get()
      ).data() as ParentProp;

      // Remove Club
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(studentId as string)
        .collection("clubs")
        .doc(clubId as string)
        .delete();

      // Refund Money

      // Check for Existing Invoice
      let invoiceData: InvoiceProp | null = null;
      const unpaidInvoices = (
        await firebaseAdmin
          .firestore()
          .collection("invoices")
          .where("parentId", "==", studentData.parentId)
          .where("paid", "==", false)
          .get()
      ).docs;
      if (unpaidInvoices.length > 0) {
        invoiceData = unpaidInvoices[0].data() as InvoiceProp;
        invoiceData.lineItems = invoiceData.lineItems.filter(
          (item) => item.club.id !== club.id
        );
        (invoiceData.total -= parentData.hasDiscount
          ? (clubData.price * 3) / 2
          : clubData.price * 3),
          (invoiceData.discount -= parentData.hasDiscount
            ? (clubData.price * 3) / 2
            : 0),
          await firebaseAdmin
            .firestore()
            .collection("invoices")
            .doc(String(invoiceData.id))
            .set(invoiceData, { merge: true });
      } else {
        await firebaseAdmin
          .firestore()
          .collection("users")
          .doc(studentData.parentId)
          .update({
            "funds.amount": firebaseAdmin.firestore.FieldValue.increment(
              -(parentData.hasDiscount
                ? (clubData.price * club.quantity) / 2
                : clubData.price * club.quantity)
            ),
          });
      }

      res.statusCode = 200;
      res.json({ status: true });
      res.end();
      return;
    } catch (error) {
      res.statusCode = 200;
      res.json({ status: false, error: error.message });
      res.end();
      return;
    }
  } else {
    res.statusCode = 200;
    res.json({ status: false, error: "Method Not Allowed!" });
    res.end();
    return;
  }
};
