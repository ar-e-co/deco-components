import { ForwardedRef, forwardRef, memo } from "preact/compat";
import { ComponentChildren } from "preact";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "preact/hooks";

import DecoVideo, {
  Props as DecoVideoProps,
} from "apps/website/components/Video.tsx";
import Image from "apps/website/components/Image.tsx";

import type { AnatomyClasses } from "deco-components/sdk/styles.ts";
import { clx } from "deco-components/sdk/clx.ts";
import { useVideo } from "deco-components/sdk/useVideo.ts";
import useZoomInPlace from "deco-components/sdk/useZoomInPlace.ts";

const anatomy = [
  "container",
  "video",
  "poster",
] as const;

export type VideoClasses = AnatomyClasses<typeof anatomy[number]>;

export interface Props extends Omit<DecoVideoProps, "children"> {
  poster: string;
  description: string;
  uploadDate?: string;
  classes?: VideoClasses;
  children?: ComponentChildren;
  videoChildren?: DecoVideoProps["children"];
  actionOnClick?: "zoom-in-place" | "custom";
}

/**
 * @description Import as an **island**. Use this component IF:
 * - Your component has some action on click, such as zooming in place.
 * - It's a **mobile** device. Useful for iOS low battery power mode, where videos
 *   do not start automatically.
 *   Use `apps/website/components/Video.tsx` otherwise.
 */
function Video({
  classes,
  width,
  height,
  description,
  poster,
  type,
  children,
  videoChildren,
  actionOnClick,
  onClick,
  ...props
}: Props, forwardedRef: ForwardedRef<HTMLVideoElement>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);

  const [showVideo, setShowVideo] = useState(false);

  // Allow us to use the video player both inside and outside of the component
  useImperativeHandle(forwardedRef, () => playerRef.current!, []);
  const { ref: zoomableRef, toggleZoom, moveZoom, zoomEnabled } =
    useZoomInPlace();

  const { networkStatus } = useVideo(playerRef, containerRef);

  function handleVideoClick(e: MouseEvent) {
    if (!actionOnClick) return;

    if (actionOnClick === "zoom-in-place") {
      toggleZoom(e);
    } else {
      // deno-lint-ignore no-explicit-any
      onClick?.(e as any); // I couldn't type this :(
    }
  }

  const handleVideoPlayEvent = useCallback(() => {
    setShowVideo(true);
  }, []);

  const playVideo = useCallback(() => {
    playerRef.current?.load();
    playerRef.current?.play();
  }, [playerRef]);

  // When on low power mode, the video will not autoplay
  // This is a workaround to make sure a good poster is shown in that case.
  // Once the video is played, the poster will be hidden.
  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    playerRef.current.addEventListener("play", handleVideoPlayEvent);
    playVideo();

    return () =>
      playerRef.current?.removeEventListener("play", handleVideoPlayEvent);
  }, []);

  function renderPoster(extraClasses?: string) {
    return (
      <Image
        class={clx(
          "absolute top-0 left-0 block w-full h-full object-cover",
          classes?.poster,
          extraClasses,
        )}
        src={poster}
        alt={description}
        width={width}
        height={height}
      />
    );
  }

  if (networkStatus === "NETWORK_NO_SOURCE") {
    return renderPoster();
  }

  return (
    <div
      ref={containerRef}
      class={clx("relative overflow-hidden", classes?.container)}
    >
      <div
        ref={zoomableRef}
        class={clx(
          "relative w-full h-full",
          actionOnClick === "zoom-in-place" && "cursor-zoom",
        )}
        onClick={handleVideoClick}
        {...zoomEnabled && {
          onMouseMove: moveZoom,
        }}
      >
        <DecoVideo
          {...props}
          ref={playerRef}
          height={height} // Hack to make typescript happy
          width={width}
          class={clx("block w-full h-full object-cover", classes?.video)}
          type={type ? `video/${type}` : undefined}
        >
          {videoChildren}
          {renderPoster()}
        </DecoVideo>

        {!showVideo && renderPoster("z-100 bg-white")}

        {!!children && (
          <div class="absolute top-0 left-0 w-full h-full object-cover z-2 pointer-events-none">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(forwardRef(Video));
