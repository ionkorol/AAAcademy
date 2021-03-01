// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { contentfulAdmin, contentfulClient } from "utils/contentful";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const data = await contentfulClient.getEntry("12341");
    res.statusCode = 200;
    res.json(data.fields);
  } else if (req.method === "POST") {
    const entry = await (
      await (await contentfulAdmin.getSpace("xy48kwi10upb")).getEnvironment(
        "master"
      )
    ).createEntryWithId("user.parent", "12341", {
      fields: {
        firstName: {
          "en-US": "Alina",
        },
        lastName: {
          "en-US": "Petro",
        },
        email: {
          "en-US": "1998-09-03",
        },
        phone: {
          "en-US": "6784622914",
        },
        accountFunds: {
          "en-US": 0,
        },
        ecName: {
          "en-US": "Ion Sobol",
        },
        ecPhone: {
          "en-US": "1231231",
        },
        address: {
          "en-US": {
            sys: {
              type: "Link",
              linkType: "Entry",
              id: "5xsjtR2QptkewPXl361voi",
            },
          },
        },
        hasDiscount: {
          "en-US": false,
        },
        paidRegistration: {
          "en-US": false,
        },
        children: [],
      },
    });
    await entry.publish();
    res.statusCode = 200;
    res.json(entry);
  } else if (req.method === "PUT") {
    const entry = await (
      await (await contentfulAdmin.getSpace("xy48kwi10upb")).getEnvironment(
        "master"
      )
    ).createEntryWithId("user.student", "123412", {
      fields: {
        firstName: {
          "en-US": "Pavel",
        },
        lastName: {
          "en-US": "Sobol",
        },
        email: {
          "en-US": "pm@gmail.com",
        },
        phone: {
          "en-US": "6784622914",
        },
        dob: {
          "en-US": "1998-09-03",
        },
        clubs: {
          "en-US": [
            {
              sys: {
                type: "Link",
                linkType: "Entry",
                id: "3LcTyTTvZyrKkN7GE0wdvT",
              },
            },
          ],
        },
        parent: {
          "en-US": {
            sys: {
              type: "Link",
              linkType: "Entry",
              id: "12341",
            },
          },
        },
      },
    });
    await entry.publish();
    res.statusCode = 200;
    res.json({ status: true });
  } else {
    res.statusCode = 200;
    res.json({ status: false });
  }
};
