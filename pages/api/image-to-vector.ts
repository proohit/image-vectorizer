import { Fields, IncomingForm } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { Posterizer, PosterizerOptions } from "potrace";
import Settings from "../../src/types/Settings";
import { SvgColorizerService } from "../../src/utils/SvgColorizerService";

const convertImageToSvg = (
  image: string | Buffer,
  options: PosterizerOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const posterizer = new Posterizer(options);
    posterizer.loadImage(image, (_, err) => {
      console.log(err);
      if (err) reject(err);
      resolve(posterizer.getSVG());
    });
  });
};

const readFormData = (
  req: NextApiRequest
): Promise<{ fields: Fields; file: Buffer }> => {
  return new Promise(function (resolve, reject) {
    const form = new IncomingForm();
    const res = { fields: {}, file: Buffer.from([]) };

    form.onPart = (part) => {
      part.on("data", (data) => {
        if (part.name === "image") {
          res.file = Buffer.concat([res.file, data]);
        } else {
          res.fields[part.name] = data.toString("utf8");
        }
      });
    };

    form.parse(req, (err) => {
      if (err) reject(err);
      resolve(res);
    });
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await readFormData(req);

  const { fields, file } = data;
  const options: Settings = JSON.parse(fields.options as string);
  try {
    let svg: string;
    if (options.colorized) {
      const potraceService = new SvgColorizerService();
      const png = await potraceService.getPng(file);
      const posterizedSvg = await potraceService.getPosterizedSvg(png);
      const solidSvg = potraceService.getSolidSvg(posterizedSvg);
      svg = await potraceService.getColorizedSvg(solidSvg, file);
    } else {
      svg = await convertImageToSvg(file, options);
    }
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
