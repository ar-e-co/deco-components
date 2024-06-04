import { ForwardedRef, forwardRef, memo } from "preact/compat";
import { ComponentChildren } from "preact";
import DecoImage, {
  Props as DecoImageProps,
} from "apps/website/components/Image.tsx";

import type { AnatomyClasses } from "deco-components/sdk/styles.ts";
import { clx } from "deco-components/sdk/clx.ts";
import useZoomInPlace from "deco-components/sdk/useZoomInPlace.ts";

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
  actionOnClick?: "zoom-in-place" | "modal" | "custom";
  children?: ComponentChildren;
}

/**
 * Wrapper around Deco optimized Image component with padding-top aspect ratio hack.
 * @description Import as an **island** if you want actions on click. Import directly otherwise
 */
const Image = forwardRef(function Image({
  width,
  height,
  classes,
  secondaryImage,
  actionOnHover,
  actionOnClick,
  children,
  ...props
}: Props, ref: ForwardedRef<HTMLImageElement>) {
  const aspectRatio = width / height;
  const paddingTop = `${parseFloat((1 / aspectRatio).toFixed(2)) * 100}%`;

  return (
    <div
      class={clx(
        "relative group overflow-hidden",
        actionOnClick === "zoom-in-place" && "cursor-zoom",
        classes?.container,
      )}
      style={{ paddingTop }}
    >
      <DecoImage
        ref={ref}
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

      {!!children && (
        <div class="absolute top-0 left-0 w-full h-full object-cover z-2 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
});

export function ImageIsland({ actionOnClick, onClick, ...rest }: Props) {
  const { ref, toggleZoom, moveZoom, zoomEnabled } = useZoomInPlace<
    HTMLImageElement
  >();

  function handleImageClick(e: MouseEvent) {
    if (!actionOnClick) return;

    if (actionOnClick === "zoom-in-place") {
      toggleZoom(e);
    } else if (actionOnClick === "modal") {
      // open modal
    } else {
      // deno-lint-ignore no-explicit-any
      onClick?.(e as any); // I couldn't type this :(
    }
  }

  return (
    <Image
      ref={ref}
      onClick={handleImageClick}
      actionOnClick={actionOnClick}
      {...rest}
      {...zoomEnabled && {
        onMouseMove: moveZoom,
      }}
    />
  );
}

export default memo(Image);
