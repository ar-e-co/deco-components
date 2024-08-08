import { ForwardedRef, forwardRef, useImperativeHandle } from "preact/compat";
import Image, { Props as ImageProps } from "apps/website/components/Image.tsx";

import useZoomInPlace from "deco-components/sdk/useZoomInPlace.ts";
import { clx } from "deco-components/sdk/clx.ts";

export type Props = ImageProps & {
  height: number;
  actionOnClick?: "zoom-in-place" | "modal" | "custom";
};

function ZoomableImage({
  actionOnClick,
  onClick,
  class: _class,
  className,
  ...rest
}: Props, forwardedRef: ForwardedRef<HTMLImageElement>) {
  const { ref, toggleZoom, moveZoom, zoomEnabled } = useZoomInPlace<
    HTMLImageElement
  >();

  // Allow us to use the video player both inside and outside of the component
  useImperativeHandle(forwardedRef, () => ref.current!, []);

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
      class={clx("cursor-zoom", _class as string, className as string)}
      {...rest}
      {...zoomEnabled && {
        onMouseMove: moveZoom,
      }}
    />
  );
}

export default forwardRef(ZoomableImage);
