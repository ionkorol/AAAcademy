import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { from, subject, message } = req.body;
    const transporter = nodemailer.createTransport({
      host: process.env.SUPPORT_EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
      },
    });

    const mailOptions: Mail.Options = {
      from: process.env.SUPPORT_EMAIL,
      to: process.env.SUPPORT_EMAIL,
      subject,
      text: message,
      sender: from,
      replyTo: from,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.statusCode = 200;
        res.json({ status: false, data: error });
      } else {
        console.log("Email sent: " + info.response);
        res.statusCode = 200;
        res.json({ status: true, data: info.response });
      }
    });
  } else {
    res.statusCode = 405;
    res.end();
  }
};