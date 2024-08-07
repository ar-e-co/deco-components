import { IS_BROWSER } from "$fresh/runtime.ts";
import { useCallback, useEffect, useState } from "preact/hooks";
import { APP_URL } from "deco-components/sdk/sizebay/constants.ts";
import { clx } from "deco-components/sdk/clx.ts";

export interface Props {
  mode: "vfr" | "chart";
  productId: string;
  sid: string;
  tenantId: number;
  lang: string;
  class?: string;
  loadingClass?: string;
  /** @description **MUST** be memoized */
  onClose: () => void;
}

function SizebayIFrame({
  mode,
  productId,
  sid,
  tenantId,
  lang,
  class: _class,
  loadingClass,
  onClose,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);

  const handleClose = useCallback((event: MessageEvent) => {
    if (event.data !== "close-fitting-room") {
      return;
    }

    onClose();
  }, []);

  useEffect(() => {
    globalThis.addEventListener("message", handleClose);

    return () => {
      globalThis.removeEventListener("message", handleClose);
    };
  }, []);

  if (!IS_BROWSER) {
    return null;
  }

  return (
    <iframe
      className={clx("relative", _class, isLoading && loadingClass)}
      id="szb-modal"
      src={`${APP_URL}V4/?mode=${mode}&id=${productId}&sid=${sid}&tenantId=${tenantId}&lang=${lang}&watchOpeningEvents=true`}
      frameBorder="0"
      onLoad={() => setIsLoading(false)}
    />
  );
}

export default SizebayIFrame;
