import { ImageObject, VideoObject } from "apps/commerce/types.ts";

export function getProductMedia(
  _images: ImageObject[],
  _videos: VideoObject[] = [],
) {
  const images = _images
    .map((img, index) => ({
      ...img,
      _sortKey: index,
      isFirstImage: index === 0,
    }));

  const videos = _videos
    .map((video) => {
      if (!video.contentUrl) {
        return null;
      }

      const urlSplit = video.contentUrl.split("/");
      const [name, extension] = urlSplit[urlSplit.length - 1].split(".");
      const [, _sortKey] = name.split("_");
      const type = `video/${extension}`;

      return {
        id: name,
        type,
        ...video,
        _sortKey: Number(_sortKey),
      };
    })
    .filter(Boolean) as Array<VideoObject & { _sortKey: number }>;

  const medias = [...videos, ...images].sort((a, b) => {
    if (a?._sortKey === b?._sortKey) {
      // videos come first
      return a["@type"] === "VideoObject" ? -1 : 1;
    }

    return a._sortKey > b._sortKey ? 1 : -1;
  });

  return medias;
}

export default getProductMedia;
