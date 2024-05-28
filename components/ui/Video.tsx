import { ForwardedRef, forwardRef } from "preact/compat";
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

const anatomy = [
  "container",
  "video",
  "poster",
] as const;

export type VideoClasses = AnatomyClasses<typeof anatomy[number]>;

export interface Props extends DecoVideoProps {
  poster: string;
  description: string;
  uploadDate?: string;
  classes?: VideoClasses;
}

function Video({
  classes,
  width,
  height,
  description,
  poster,
  type,
  ...props
}: Props, forwardedRef: ForwardedRef<HTMLVideoElement>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);

  const [showVideo, setShowVideo] = useState(false);

  const aspectRatio = parseFloat((width / height).toFixed(2));
  const paddingTop = `${parseFloat((1 / aspectRatio).toFixed(2)) * 100}%`;

  // Allow us to use the video player both inside and outside of the component
  useImperativeHandle(forwardedRef, () => playerRef.current!, []);

  const { networkStatus } = useVideo(playerRef, containerRef);

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
      class={clx("relative", classes?.container)}
      style={{ paddingTop }}
    >
      <DecoVideo
        ref={playerRef}
        height={height}
        width={width}
        class={clx(
          "absolute top-0 left-0 block w-full h-full object-cover",
          classes?.video,
        )}
        type={type ? `video/${type}` : undefined}
        {...props}
      >
        {renderPoster()}
      </DecoVideo>

      {!showVideo && renderPoster("z-100 bg-white")}
    </div>
  );
}

export default forwardRef(Video);
