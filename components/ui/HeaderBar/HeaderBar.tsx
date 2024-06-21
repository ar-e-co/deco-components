import { useEffect, useRef, useState } from "preact/hooks";
import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

import type {
  HeaderBarCTALink,
  HeaderBarCTAModal,
  HeaderBarModal,
  HeaderBarProps,
} from "./Types.ts";
export type { HeaderBarProps as CMSHeaderBarProps } from "./Types.ts";
import Cta from './HeaderBarModal.tsx'

const anatomy = [
  "container",
  "body",
  "text",
  "ctasContainer",
  "cta",
  "ctaSeparator",
] as const;

export type HeaderBarClasses = AnatomyClasses<typeof anatomy[number]>;

export interface Props extends HeaderBarProps {
  classes?: HeaderBarClasses;
  ctaSeparator?: string;
  colorTransition?: string;
  fadeTransition?: string;
}

function ctaIsLink(
  cta: HeaderBarCTALink | HeaderBarCTAModal,
): cta is HeaderBarCTALink {
  return cta && ("href" in cta);
}

/** @description Must be an island */
function HeaderBar({
  classes,
  slides,
  interval = 7000,
  colorTransition =
    "color .7s cubic-bezier(.02,.01,0,.95), background-color .7s cubic-bezier(.02,.01,0,.95)",
  ctaSeparator = "|",
}: Props) {
  const intervalId = useRef<number | null>(null);
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const currentSlide = slides?.[currentSlideIdx];

  function startInterval() {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }

    intervalId.current = setInterval(() => {
      setCurrentSlideIdx((prev) => (prev + 1) % slides.length);
    }, interval);
  }

  function stopInterval() {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }

  function renderLinkCTA(cta: HeaderBarCTALink) {
    return (
      <a
        href={cta.href}
        class={handleClasses("underline", classes?.cta)}
      >
        {cta.label}
      </a>
    );
  }

  useEffect(() => {
    // startInterval();
  }, []);

  if (!slides?.length || !currentSlide) {
    return null;
  }

  return (
    <div
      class={handleClasses("relative w-full h-10", classes?.container)}
      style={{
        backgroundColor: currentSlide.backgroundColor ?? "#000",
        transition: colorTransition,
      }}
    >
      {slides?.map((slide, idx) => (
        <div
          class={handleClasses(
            "absolute top-0 left-0 w-full h-full justify-center items-center",
            classes?.body,
            currentSlideIdx === idx ? "flex" : "hidden",
          )}
          style={{
            color: currentSlide.foregroundColor ?? "#fff",
          }}
        >
          <span
            class={classes?.text}
            dangerouslySetInnerHTML={{ __html: slide.text }}
          />

          {(slide.ctas?.length ?? 0) > 0 && (
            <div
              class={handleClasses("ml-1 font-medium", classes?.ctasContainer)}
            >
              {" "}
              {slide.ctas?.map((cta, idx) => (
                <>
                  {idx > 0 && (
                    <span class={handleClasses("mx-1", classes?.ctaSeparator)}>
                      {ctaSeparator}
                    </span>
                  )}
                  {ctaIsLink(cta) && renderLinkCTA(cta)}
                  <Cta />
                </>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default HeaderBar;
