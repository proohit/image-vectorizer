import NearestColor from "nearest-color";
import { posterize, Potrace } from "potrace";
import quantize from "quantize";
import sharp from "sharp";
import svgo from "svgo";
import { combineOpacity, hexify, getPixels, hexToRgb } from "./image-utils";

export class SvgColorizerService {
  // ensure file type is image
  // convert all images to png
  // resize png to max width or height of 1000
  async getPng(file: Buffer) {
    let image: sharp.Sharp;
    // else, use sharp to convert the image to png
    image = sharp(file, {});

    const metadata = await image.metadata();

    const largestDimension =
      metadata.width > metadata.height ? "width" : "height";
    const ratio = 1000 / metadata[largestDimension];
    const dimensions = {
      width: Math.round(metadata.width * ratio),
      height: Math.round(metadata.height * ratio),
    };

    return image
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .resize(dimensions.width, dimensions.height, {
        withoutEnlargement: true,
        fit: "cover",
      })
      .png()
      .toBuffer();
  }

  async getSvg(png: Buffer) {
    return new Promise((resolve, reject) => {
      const trace = new Potrace();
      trace.loadImage(png, function (error) {
        if (error) return reject(error);
        return resolve(this.getSVG());
      });
    });
  }

  async getPosterizedSvg(png: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      posterize(
        png,
        {
          // https://www.npmjs.com/package/potrace#usage
          // number of colors
          // steps: 4,
        },
        function (err, svg) {
          if (err) return reject(err);
          resolve(svg);
        }
      );
    });
  }

  getSolidSvg(svg: string) {
    svg = svg.replaceAll(`fill="black"`, "");
    const opacityRegex = /fill-opacity="[\d\.]+"/gi;
    const numberRegex = /[\d\.]+/;
    const matches = svg.match(opacityRegex);
    const colors = Array.from(new Set(matches))
      .map((fillOpacity) => ({
        fillOpacity,
        opacity: Number(fillOpacity.match(numberRegex)[0]),
      }))
      .sort((a, b) => b.opacity - a.opacity)
      .map(({ fillOpacity, opacity }, index, array) => {
        // combine all lighter opacities into dark opacity
        const lighterColors = array.slice(index);
        const trueOpacity = lighterColors.reduce(
          (acc, cur) => combineOpacity(acc, cur.opacity),
          0
        );
        // turn opacity into hex
        const hex = hexify(`rgba(0, 0, 0, ${trueOpacity})`);
        return {
          trueOpacity,
          fillOpacity,
          opacity,
          hex,
        };
      });
    for (const color of colors) {
      svg = svg.replaceAll(color.fillOpacity, `fill="${color.hex}"`);
    }
    return svg;
  }

  async getColorizedSvg(svg: string, original: Buffer) {
    const hexRegex = /#([a-f0-9]{3}){1,2}\b/gi;
    const matches = svg.match(hexRegex);
    const colors = Array.from(new Set(matches));

    const pixelIndexesOfNearestColors = {}; // final structure: { hex: [array of pixel indexes] }
    colors.forEach((color) => (pixelIndexesOfNearestColors[color] = []));

    const svgPixels = await getPixels(Buffer.from(svg));

    const nearestColor = NearestColor.from(colors);

    svgPixels.pixels.forEach((pixel, index) => {
      // curly braces for scope https://stackoverflow.com/a/49350263
      switch (svgPixels.channels) {
        case 3: {
          const [r, g, b] = pixel;
          const rgb = `rgb(${r}, ${g}, ${b})`;
          const hex = hexify(rgb);
          pixelIndexesOfNearestColors[nearestColor(hex)].push(index);
          break;
        }
        case 4: {
          const [r, g, b, a] = pixel;
          const rgba = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
          const hex = hexify(rgba);
          pixelIndexesOfNearestColors[nearestColor(hex)].push(index);
          break;
        }
        default:
          throw new Error("Unsupported number of channels");
      }
    });

    const originalPixels = await getPixels(original);
    const pixelsOfNearestColors = pixelIndexesOfNearestColors; // final structure: { hex: [array of pixel indexes] }
    Object.keys(pixelsOfNearestColors).forEach((hexKey) => {
      pixelsOfNearestColors[hexKey] = pixelsOfNearestColors[hexKey].map(
        (pixelIndex) => {
          const pixel = originalPixels.pixels[pixelIndex];
          switch (originalPixels.channels) {
            case 3: {
              const [r, g, b] = pixel;
              const rgb = `rgb(${r}, ${g}, ${b})`;
              return hexify(rgb);
            }
            case 4: {
              const [r, g, b, a] = pixel;
              const rgba = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
              return hexify(rgba);
            }
            default:
              throw new Error("Unsupported number of channels");
          }
        }
      );
    });

    const colorsToReplace = pixelsOfNearestColors; // final structure: { hex: hex }

    // get palette of 5 https://github.com/lokesh/color-thief/blob/master/src/color-thief-node.js#L61
    Object.keys(pixelsOfNearestColors).forEach((hexKey) => {
      const pixelArray = colorsToReplace[hexKey].map(hexToRgb);
      const colorMap = quantize(pixelArray, 5);
      const [r, g, b] = colorMap.palette()[0];
      const rgb = `rgb(${r}, ${g}, ${b})`;
      colorsToReplace[hexKey] = hexify(rgb);
    });
    Object.entries(colorsToReplace).forEach(([oldColor, newColor]) => {
      svg = svg.replaceAll(oldColor, newColor as string);
    });

    return svg;
  }

  async getOptimizedSvg(svg: string) {
    return svgo.optimize(svg);
  }
}
