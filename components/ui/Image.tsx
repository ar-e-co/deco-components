import DecoImage, {
  Props as DecoImageProps,
} from "apps/website/components/Image.tsx";
import type { AnatomyClasses } from "deco-components/sdk/styles.ts";
import { clx } from "deco-components/sdk/clx.ts";

const anatomy = [
  "container",
  "image",
] as const;

export type ImageClasses = AnatomyClasses<typeof anatomy[number]>;

export interface Props extends DecoImageProps {
  height: number;
  classes?: ImageClasses;
}

function Image({
  width,
  height,
  classes,
  ...props
}: Props) {
  const aspectRatio = parseFloat((width / height).toFixed(2));
  const paddingTop = `${parseFloat((1 / aspectRatio).toFixed(2)) * 100}%`;

  return (
    <div
      class={clx("relative", classes?.container)}
      style={{ paddingTop }}
    >
      <DecoImage
        class={clx(
          "absolute block top-0 left-0 w-full h-full object-cover",
          classes?.image,
        )}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
}

export default Image;
