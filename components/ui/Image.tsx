import { useState } from "preact/hooks";
import { ComponentChildren } from "preact";
import DecoImage, {
  Props as DecoImageProps,
} from "apps/website/components/Image.tsx";

import type { AnatomyClasses } from "deco-components/sdk/styles.ts";
import { clx } from "deco-components/sdk/clx.ts";
import { disableZoom, moveZoom } from "deco-components/sdk/zoomInPlace.ts";
import useOutsideClick from "deco-components/sdk/useOutsideClick.ts";

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
function Image({
  width,
  height,
  classes,
  secondaryImage,
  actionOnHover,
  actionOnClick,
  onClick,
  children,
  ...props
}: Props) {
  const [zoomInPlace, setZoomInPlace] = useState(false);
  const aspectRatio = parseFloat((width / height).toFixed(2));
  const paddingTop = `${parseFloat((1 / aspectRatio).toFixed(2)) * 100}%`;

  function handleImageClick(e: MouseEvent) {
    if (!actionOnClick) {
      return;
    }

    if (actionOnClick === "zoom-in-place") {
      if (zoomInPlace) {
        disableZoom(e);
      } else {
        moveZoom(e);
      }

      setZoomInPlace((prev) => !prev);
    } else if (actionOnClick === "modal") {
      // open modal
    } else {
      // deno-lint-ignore no-explicit-any
      onClick?.(e as any); // I couldn't type this :(
    }
  }

  // Disables zoom when clicking outside the image
  const ref = useOutsideClick<HTMLImageElement>((e: MouseEvent) => {
    if (actionOnClick === "zoom-in-place") {
      disableZoom({ target: ref.current } as unknown as MouseEvent);
      setZoomInPlace(false);
    }
  });

  return (
    <div
      class={clx(
        "relative group overflow-hidden",
        (actionOnHover || actionOnClick) && "cursor-pointer",
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
        onClick={handleImageClick}
        {...props}
        {...zoomInPlace && {
          onMouseMove: moveZoom,
        }}
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
}

export default Image;
