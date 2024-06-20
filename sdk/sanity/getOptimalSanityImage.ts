// From https://hdoro.dev/performant-sanity-io-images
import type {
  ImageUrlBuilder,
  SanityImageObject,
} from "deco-components/sdk/sanity/Types.ts";

function calcAspectRatio(userAspectRatio?: string | number) {
  if (!userAspectRatio) {
    return null;
  }

  if (typeof userAspectRatio === "number") {
    return userAspectRatio;
  }

  const [width, height] = userAspectRatio.split("/").map(Number);

  if (!width || !height || Number.isNaN(width) || Number.isNaN(height)) {
    return null;
  }

  return width / height;
}

function getImageDimensions(
  image: SanityImageObject,
  userAspectRatio?: string | number,
) {
  if (!image?.asset?._ref) {
    return;
  }

  // eslint-disable-next-line prefer-destructuring
  const dimensions = image.asset._ref.split("-")[2];

  const [width, height] = dimensions.split("x").map(Number);

  if (!width || !height || Number.isNaN(width) || Number.isNaN(height)) {
    return;
  }

  const aspectRatio = calcAspectRatio(userAspectRatio);

  return {
    width,
    height,
    aspectRatio: aspectRatio ?? width / height,
  } as {
    width: number;
    height: number;
    aspectRatio: number;
  };
}

const LARGEST_VIEWPORT = 1920; // Retina sizes will take care of 4k (2560px) and other huge screens

const DEFAULT_MIN_STEP = 0.1; // 10%
const DEFAULT_WIDTH_STEPS = [400, 600, 850, 1000, 1150]; // arbitrary
// Based on statcounter's most common screen sizes: https://gs.statcounter.com/screen-resolution-stats
const DEFAULT_FULL_WIDTH_STEPS = [360, 414, 768, 1366, 1536, 1920];

export type ImagePropsOptions = {
  /**
   * The image's reference object.
   * Example: {asset: {_ref: string}, hotspot: {...}, crop: {...} }
   */
  image: SanityImageObject | null | undefined;
  // The image URL builder instance
  imageBuilder: ImageUrlBuilder | null | undefined;
  // Number of the largest width it can assume in the design
  // or "100vw" if it occupies the whole width
  maxWidth?: number | "100vw";
  /**
   * The minimal width difference, in PERCENTAGE (decimal), between the image's srcSet variations.
   *
   * -> 0.10 (10%) by default.
   */
  minimumWidthStep?: number;
  // List of width sizes to use in the srcSet (NON-RETINA)
  customWidthSteps?: number[];
  // Custom <img> element's `sizes` attribute
  sizes?: string;
  // Aspect ratio of the image
  aspectRatio?: string | number;
  // Use Hotspot
  useHotspot?: boolean;
};

export default function getOptimalSanityImage({
  image,
  maxWidth: userMaxWidth,
  minimumWidthStep = DEFAULT_MIN_STEP,
  customWidthSteps,
  sizes,
  imageBuilder,
  aspectRatio: userAspectRatio,
  useHotspot,
}: ImagePropsOptions) {
  if (!imageBuilder || !image?.asset?._ref) {
    return {};
  }

  const maxWidth = typeof userMaxWidth === "number"
    ? userMaxWidth
    : LARGEST_VIEWPORT;

  // For all image variations, we'll use an auto format and prevent scaling it over its max dimensions
  let builder = imageBuilder.image(image).fit("max").auto("format");

  // Does not work without aspect ratio
  if (useHotspot && image.hotspot) {
    builder = builder
      .crop("focalpoint")
      .focalPoint(image.hotspot.x, image.hotspot.y)
      .fit("crop");
  }

  const imageDimensions = getImageDimensions(image, userAspectRatio);

  if (!imageDimensions) {
    return {};
  }

  // Width sizes the image could assume
  const baseSizes = [
    maxWidth,
    ...(customWidthSteps ??
      (typeof userMaxWidth === "number"
        ? DEFAULT_WIDTH_STEPS
        : DEFAULT_FULL_WIDTH_STEPS)),
  ];

  const retinaSizes = Array.from(
    // De-duplicate sizes with a Set
    new Set([
      ...baseSizes,
      ...baseSizes.map((size) => size * 2),
      ...baseSizes.map((size) => size * 3),
    ]),
  )
    .sort((a, b) => a - b) // Lowest to highest
    .filter(
      (size) =>
        // Exclude sizes 10% or more larger than the image itself. Sizes slightly larger
        // than the image are included to ensure we always get closest to the highest
        // quality for an image. Sanity's CDN won't scale the image above its limits.
        size <= imageDimensions.width * 1.1 &&
        // Exclude those larger than maxWidth's retina (x3)
        size <= maxWidth * 3,
    )
    // Exclude those with a value difference to their following size smaller than `minimumWidthStep`
    // This ensures we don't have too many srcSet variations, polluting the HTML
    .filter((size, i, arr) => {
      const nextSize = arr[i + 1];

      if (nextSize) {
        return nextSize / size > minimumWidthStep + 1;
      }

      return true;
    });

  return {
    // Use the original image as the `src` for the <img>
    src: builder
      .width(maxWidth)
      .height(
        userAspectRatio
          ? Math.round(maxWidth / imageDimensions.aspectRatio)
          : (undefined as unknown as number),
      )
      .url(),

    // Build a `{URL} {SIZE}w, ...` string for the srcset
    srcSet: retinaSizes
      .map(
        (size) =>
          `${
            builder
              .width(size)
              .height(
                userAspectRatio
                  ? Math.round(size / imageDimensions.aspectRatio)
                  : (undefined as unknown as number),
              )
              .url()
          } ${size}w`,
      )
      .join(", "),
    sizes: userMaxWidth === "100vw"
      ? "100vw"
      : sizes ?? `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`,

    // Let's also tell the browser what's the size of the image so it can calculate aspect ratios
    width: retinaSizes[0],
    height: Math.round(retinaSizes[0] / imageDimensions.aspectRatio),
  };
}
