import sharp from "sharp";

export function hexToRgb(hex: string) {
  return hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => "#" + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16));
}

// https://stackoverflow.com/a/35663683
export function hexify(color: string) {
  const values = color
    .replace(/rgba?\(/, "")
    .replace(/\)/, "")
    .replace(/[\s+]/g, "")
    .split(",");
  const a = parseFloat(values[3] || "1");
  const r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255);
  const g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255);
  const b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
  return (
    "#" +
    ("0" + r.toString(16)).slice(-2) +
    ("0" + g.toString(16)).slice(-2) +
    ("0" + b.toString(16)).slice(-2)
  );
}

// https://graphicdesign.stackexchange.com/a/91018
export function combineOpacity(a: number, b: number) {
  return 1 - (1 - a) * (1 - b);
}

export async function getPixels(input: Buffer) {
  const image = sharp(input);
  const metadata = await image.metadata();
  const raw = await image.raw().toBuffer();

  const pixels = [];
  for (let i = 0; i < raw.length; i = i + metadata.channels) {
    const pixel = [];
    for (let j = 0; j < metadata.channels; j++) {
      pixel.push(raw.readUInt8(i + j));
    }
    pixels.push(pixel);
  }
  return { pixels, ...metadata };
}
