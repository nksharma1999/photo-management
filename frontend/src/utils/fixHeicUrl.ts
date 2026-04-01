import { BaseIPForThumbnails } from "../data/BaseIP";

export const fixHeicUrl = (url: string) => {
  if (typeof url !== "string") return url;

  return url.toLowerCase().endsWith(".heic")
    ? url + ".jpg"
    : url;
}

export const fixHeicThumbnailUrl = (url: string) => {
  if (typeof url !== "string") return url;

  return url.toLowerCase().endsWith(".heic")
    ? url + ".jpg"
    : url;
}

export const addBaseUrlForOriginalImg = (url: string) => {
  if (typeof url !== "string") return url;

  if (url.startsWith("/")) {
    return fixHeicUrl(`${BaseIPForThumbnails}${url}`);
  }
  return url;
}   