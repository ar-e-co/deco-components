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
  secondaryImage?: string;
  actionOnHover?: "show-secondary" | "custom";
}

function Image({
  width,
  height,
  classes,
  secondaryImage,
  actionOnHover,
  ...props
}: Props) {
  const aspectRatio = parseFloat((width / height).toFixed(2));
  const paddingTop = `${parseFloat((1 / aspectRatio).toFixed(2)) * 100}%`;

  return (
    <div
      class={clx(
        "relative group",
        actionOnHover && "cursor-pointer",
        classes?.container,
      )}
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

      {actionOnHover === "show-secondary" && !!secondaryImage && (
        <DecoImage
          class={clx(
            "absolute top-0 left-0 w-full h-full object-cover z-1 hidden group-hover:block",
            classes?.image,
          )}
          width={width}
          height={height}
          src={secondaryImage ?? ""}
        />
      )}
    </div>
  );
}

export default Image;
