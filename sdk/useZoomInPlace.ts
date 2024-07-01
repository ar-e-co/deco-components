import { useCallback, useState } from "preact/hooks";

import useOutsideClick from "deco-components/sdk/useOutsideClick.ts";

export function moveZoom(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement;

  const x = e.offsetX;
  const y = e.offsetY;

  target.style.transformOrigin = `${x}px ${y}px`;
  target.style.transform = "scale(2)";
}

export function disableZoom(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement;

  target.style.transformOrigin = "center center";
  target.style.transform = "scale(1)";
}

function useZoomInPlace<T extends HTMLDivElement>() {
  const [zoomEnabled, setZoomEnabled] = useState(false);

  const toggleZoom = useCallback(function toggleZoom(e: MouseEvent) {
    if (zoomEnabled) {
      disableZoom(e);
    } else {
      moveZoom(e);
    }

    setZoomEnabled((prev) => !prev);
  }, [zoomEnabled]);

  // Disables zoom when clicking outside the image
  const ref = useOutsideClick<T>(() => {
    disableZoom(
      {
        target: ref.current,
        currentTarget: ref.current,
      } as unknown as MouseEvent,
    );

    setZoomEnabled(false);
  });

  return {
    ref,
    toggleZoom,
    moveZoom,
    zoomEnabled,
    setZoomEnabled,
  };
}

export default useZoomInPlace;
