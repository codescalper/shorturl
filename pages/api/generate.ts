import type { NextApiRequest, NextApiResponse } from "next";
import { isWebUri } from "valid-url";
import { prisma, shortAlias } from "@/libs/index";

type RequestData = {
  url: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  if (method !== "POST") {
    return res.status(400).json({
      message: "Only POST requests are allowed",
    });
  } 

  const { url }: RequestData = JSON.parse(req.body);
  const host = req.headers.host || ""; // Ensure host has a value

  const { alias, shortUrl } = shortAlias(host, "your-alias-value");

  // Checking if original URL is valid or not
  if (!isWebUri(url)) {
    return res.status(400).json({
      statusCode: 400,
      error: {
        message: "Invalid URL",
      },
      data: null,
    });
  }
  const result = await prisma.$transaction(async (tx) => {
    // This is the query if there is any existing original URL
    const originalUrl = await tx.url.findFirst({
      where: {
        originalUrl: url,
      },
    });
    if (originalUrl) return originalUrl;

    //if there isn't we will create a new url
    const newUrl = await tx.url.create({
      data: {
        originalUrl: url,
        shortUrl,
        alias: alias,
      },
    });
    await tx.urlAnalytic.create({
      data: {
        clicked: 0,
        url: {
          connect: {
            id: newUrl.id,
          },
        },
      },
    });
    return newUrl;
  });
  return res.status(200).json({
    statusCode: 200,
    error: null,
    data: {
      originalUrl: result.originalUrl,
      shortUrl: result.shortUrl,
      alias: result.alias,
    },
  });
}
