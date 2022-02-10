import { Fields, Files, IncomingForm } from "formidable";
import Jimp from "jimp";
import type { NextApiRequest, NextApiResponse } from "next";
import potrace from "potrace";
import fs from "fs";
const convertImageToSvg = (image): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    potrace.trace(image, function (err, svg) {
      if (err) reject(err);
      resolve(svg);
    });
  });
};

type Form = {
  fields: Fields;
  files: Files;
};

const readFormData = (req: NextApiRequest): Promise<Form> => {
  return new Promise(function (resolve, reject) {
    const form = new IncomingForm();
    form.parse(req, function (err, fields, files) {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

async function retryRead(options, retries = 0) {
  let { imagePath, maxRetries = 5 } = options;

  let image = null;
  try {
    image = await Jimp.read(imagePath);
  } catch (e) {
    if (retries >= maxRetries) {
      console.log(`Failed to read image after ${maxRetries} retries`);
      throw e;
    }
    image = await retryRead(options, retries + 1);
  }

  return image;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data: Form = await readFormData(req);
  const { fields, files } = data;
  const image = files.image[0];
  const svg = await convertImageToSvg(image.filepath);
  res.status(200).setHeader("Content-Type", "image/svg+xml").send(svg);
};
export const config = {
  api: {
    bodyParser: false,
  },
};
