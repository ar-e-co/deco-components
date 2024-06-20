export interface SanityProjectConfigProp {
  /** @title Sanity Project ID */
  projectId: string;
  /**
   * @title API Version
   * @description Version of Sanity API. https://www.sanity.io/docs/api-versioning
   */
  apiVersion: string;
  /**
   * @title Dataset
   * @description Which dataset we should query your data. https://www.sanity.io/docs/datasets
   */
  dataset: string;
  /**
   * @title Enable CDN
   * @description Whether Sanity CDN should be used or not. https://www.sanity.io/docs/api-cdn
   * @default true
   * @type boolean
   */
  useCdn: boolean;
}

export type SanityProjectConfig = SanityProjectConfigProp;

export interface SanityResponse<T extends unknown = unknown> {
  config: SanityProjectConfig; // In case the loader needs to be invoked manually
  result: T;
  query: string;
  ms: number;
}

export type SanityResponseLoader = SanityResponse;

// https://github.com/sanity-io/image-url/blob/main/src/types.ts
export type ImageUrlBuilderOptions = Partial<SanityProjectDetails> & {
  baseUrl?: string;
  source?: SanityImageSource;
  bg?: string;
  dpr?: number;
  width?: number;
  height?: number;
  focalPoint?: { x: number; y: number };
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  blur?: number;
  sharpen?: number;
  rect?: { left: number; top: number; width: number; height: number };
  format?: ImageFormat;
  invert?: boolean;
  orientation?: Orientation;
  quality?: number;
  download?: boolean | string;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  ignoreImageParams?: boolean;
  fit?: FitMode;
  crop?: CropMode;
  saturation?: number;
  auto?: AutoMode;
  pad?: number;
};

export type ImageUrlBuilderOptionsWithAliases = ImageUrlBuilderOptions & {
  w?: number;
  h?: number;
  q?: number;
  fm?: number;
  dl?: boolean | string;
  or?: Orientation;
  sharp?: number;
  "min-h"?: number;
  "max-h"?: number;
  "min-w"?: number;
  "max-w"?: number;
  sat?: number;
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};

export type ImageUrlBuilderOptionsWithAsset = ImageUrlBuilderOptions & {
  asset: {
    id: string;
    width: number;
    height: number;
    format: string;
  };
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};

export type ImageFormat = "jpg" | "pjpg" | "png" | "webp";

export type FitMode =
  | "clip"
  | "crop"
  | "fill"
  | "fillmax"
  | "max"
  | "scale"
  | "min";

export type CropMode =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "center"
  | "focalpoint"
  | "entropy";

export type AutoMode = "format";

export type Orientation = 0 | 90 | 180 | 270;

export interface SanityClientLike {
  clientConfig: { dataset?: string; projectId?: string; apiHost?: string };
}

export type SanityModernClientLike = {
  config(): { dataset?: string; projectId?: string; apiHost?: string };
};

export type SanityImageSource =
  | string // Image asset ID
  | SanityReference
  | SanityAsset
  | SanityImageObject
  | SanityImageWithAssetStub;

export interface SanityProjectDetails {
  projectId: string;
  dataset: string;
}

export interface SanityReference {
  _ref: string;
}

export interface SanityImageWithAssetStub {
  asset: {
    url: string;
  };
}

export interface SanityAsset {
  _id?: string;
  url?: string;
  path?: string;
  assetId?: string;
  extension?: string;
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
}

export interface SanityImageDimensions {
  aspectRatio: number;
  height: number;
  width: number;
}

export interface SanityImageFitResult {
  width?: number;
  height?: number;
  rect: SanityImageRect;
}

export interface SanityImageRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface SanityImageCrop {
  _type?: string;
  left: number;
  bottom: number;
  right: number;
  top: number;
}

export interface SanityImageHotspot {
  _type?: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface SanityImageObject {
  asset: SanityReference | SanityAsset;
  crop?: SanityImageCrop;
  hotspot?: SanityImageHotspot;
}

export interface CropSpec {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface HotspotSpec {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export declare class ImageUrlBuilder {
  options: ImageUrlBuilderOptions;
  constructor(parent: ImageUrlBuilder | null, options: ImageUrlBuilderOptions);
  withOptions(
    options: Partial<ImageUrlBuilderOptionsWithAliases>,
  ): ImageUrlBuilder;
  image(source: SanityImageSource): ImageUrlBuilder;
  dataset(dataset: string): ImageUrlBuilder;
  projectId(projectId: string): ImageUrlBuilder;
  bg(bg: string): ImageUrlBuilder;
  dpr(dpr: number): ImageUrlBuilder;
  width(width: number): ImageUrlBuilder;
  height(height: number): ImageUrlBuilder;
  focalPoint(x: number, y: number): ImageUrlBuilder;
  maxWidth(maxWidth: number): ImageUrlBuilder;
  minWidth(minWidth: number): ImageUrlBuilder;
  maxHeight(maxHeight: number): ImageUrlBuilder;
  minHeight(minHeight: number): ImageUrlBuilder;
  size(width: number, height: number): ImageUrlBuilder;
  blur(blur: number): ImageUrlBuilder;
  sharpen(sharpen: number): ImageUrlBuilder;
  rect(
    left: number,
    top: number,
    width: number,
    height: number,
  ): ImageUrlBuilder;
  format(format: ImageFormat): ImageUrlBuilder;
  invert(invert: boolean): ImageUrlBuilder;
  orientation(orientation: Orientation): ImageUrlBuilder;
  quality(quality: number): ImageUrlBuilder;
  forceDownload(download: boolean | string): ImageUrlBuilder;
  flipHorizontal(): ImageUrlBuilder;
  flipVertical(): ImageUrlBuilder;
  ignoreImageParams(): ImageUrlBuilder;
  fit(value: FitMode): ImageUrlBuilder;
  crop(value: CropMode): ImageUrlBuilder;
  saturation(saturation: number): ImageUrlBuilder;
  auto(value: AutoMode): ImageUrlBuilder;
  pad(pad: number): ImageUrlBuilder;
  url(): string;
  toString(): string;
}
