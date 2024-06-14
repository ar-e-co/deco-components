import { ComponentChildren } from "preact";
import DecoImage, {
  Props as ImageProps,
} from "apps/website/components/Image.tsx";

import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

const anatomy = [
  "container",
  "image",
  "content",
] as const;

type ImageWithTextClasses = AnatomyClasses<typeof anatomy[number]>;

interface Props extends ImageProps {
  children?: ComponentChildren;
  classes?: ImageWithTextClasses;
  width: number;
  height?: number;
  href?: string;
}

function ImageWithText({
  classes,
  href,
  children,
  width,
  height,
  ...props
}: Props) {
  let aspectRatio;
  let paddingTop;

  if (height) {
    aspectRatio = width / height;
    paddingTop = `${parseFloat((1 / aspectRatio).toFixed(2)) * 100}%`;
  }

  return (
    <a
      href={href}
      class={handleClasses("group relative block", classes?.container)}
      {...paddingTop && { style: { paddingTop, height: 0 } }}
    >
      <DecoImage
        class={handleClasses(
          "absolute top-0 left-0 block w-full h-full object-cover",
          classes?.image,
        )}
        loading="lazy"
        height={height}
        width={width}
        {...props}
      />

      <div
        class={handleClasses(
          "absolute top-0 left-0 w-full h-full font-medium text-gray-1000",
          classes?.content,
        )}
      >
        {children}
      </div>
    </a>
  );
}

export default ImageWithText;
