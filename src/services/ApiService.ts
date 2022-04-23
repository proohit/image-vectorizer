import Settings from "../types/Settings";

export const uploadImage = async (
  image: ArrayBuffer,
  type: string,
  settings: Settings
) => {
  const formData = new FormData();
  formData.set("image", new Blob([image], { type }));
  formData.set("options", JSON.stringify(settings));
  formData.set("type", type);
  const res = await fetch("/api/image-to-vector", {
    method: "POST",
    body: formData,
  });
  if (!res.ok || res.status < 200 || res.status >= 300) {
    throw new Error(await res.json());
  } else {
    const svg = await res.text();
    return svg;
  }
};
