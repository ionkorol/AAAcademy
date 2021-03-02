// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiResponse, NextApiRequest } from "next";
import firebaseAdmin from "utils/firebaseAdmin";
import { getRemainingWeeks } from "utils/functions";
import {
  ApiResProp,
  ClubProp,
  InvoiceProp,
  LineItemProp,
  ParentProp,
  StudentProp,
} from "utils/interfaces";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { clubId, studentId, userId } = req.query;

  if (req.method === "POST") {
    // Add club to child
    try {
      // Get student data
      const studentData = ((await (
        await fetch(
          `${process.env.SERVER}/api/parents/${userId}/students/${studentId}`
        )
      ).json()) as ApiResProp).data as StudentProp;

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
          .doc(userId as string)
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
      for (const club of studentData.clubs) {
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
        .doc(userId as string)
        .collection("students")
        .doc(studentId as string)
        .collection("clubs")
        .doc(clubId as string)
        .set({
          id: clubId,
          quantity: 0,
        });

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
    // Remove club from child
    const { quantity } = req.body;
    try {

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
          .doc(userId as string)
          .get()
      ).data() as ParentProp;

      // Remove Club
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(userId as string)
        .collection("students")
        .doc(studentId as string)
        .collection("clubs")
        .doc(clubId as string)
        .delete();

      // Refund Money
      await firebaseAdmin
        .firestore()
        .collection("users")
        .doc(userId as string)
        .update({
          "funds.amount": firebaseAdmin.firestore.FieldValue.increment(
            -(parentData.hasDiscount
              ? (clubData.price * quantity) / 2
              : clubData.price * quantity)
          ),
        });

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
