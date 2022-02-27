import { Fields, Files, IncomingForm } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { trace } from "potrace";

const convertImageToSvg = (image): Promise<string> => {
  return new Promise((resolve, reject) => {
    trace(image, (err, svg) => {
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
