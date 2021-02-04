// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { contentfulAdmin, contentfulClient } from "utils/contentful";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const data = await contentfulClient.getEntry("4ZxRHzeppilcl6zCYKR5sB");
    res.statusCode = 200;
    res.json(data.fields);
  } else if (req.method === "POST") {
    const entry = await (
      await (await contentfulAdmin.getSpace("xy48kwi10upb")).getEnvironment(
        "master"
      )
    ).createEntry("user", {
      fields: {
        firstName: {
          "en-US": "Petr",
        },
        lastName: {
          "en-US": "Petro",
        },
      },
    });
    res.statusCode = 200;
    res.json(entry);
  } else {
    res.statusCode = 200;
    res.json({ status: false });
  }
};
