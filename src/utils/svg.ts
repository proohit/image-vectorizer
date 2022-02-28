export const getSvgDataUrl = (svg: string) => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
