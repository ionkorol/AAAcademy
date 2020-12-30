// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import firebaseAdmin from "../../utils/firebaseAdmin"

export default async (req, res) => {
  const snap = await firebaseAdmin.firestore().collection('clubs').doc('Art').get()
  res.statusCode = 200
  res.json(snap.data())
}
