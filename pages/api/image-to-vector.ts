import { Fields, Files, IncomingForm } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { Posterizer, PosterizerOptions } from "potrace";
import Settings from "../../src/types/Settings";

const convertImageToSvg = (
  image: string | Buffer,
  options: PosterizerOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const posterizer = new Posterizer(options);
    posterizer.loadImage(image, (_, err) => {
      if (err) reject(err);
      resolve(posterizer.getSVG());
    });
  });
};

type Form = {
  fields: Fields;
  files: Files;
};

const readFormData = (req: NextApiRequest): Promise<Form> => {
  return new Promise(function (resolve, reject) {
    const form = new IncomingForm({ uploadDir: "/tmp" });
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
  const options: Settings = JSON.parse(fields.options as string);
  try {
    const svg = await convertImageToSvg(image.filepath, options);
    res.status(200).setHeader("Content-Type", "image/svg+xml").send(svg);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
