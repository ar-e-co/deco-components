import { signal } from "@preact/signals";
import { getCookieSzb } from "deco-components/sdk/sizebay/cookie.ts";
import {
  createSID,
  SZB_COOKIE_NAME,
} from "deco-components/sdk/sizebay/fetcher.ts";

const recommendedSize = signal<string | null>(null);
const sid = signal<string | null>(null);

async function initSZB() {
  const SID = getCookieSzb(SZB_COOKIE_NAME)
    ? getCookieSzb(SZB_COOKIE_NAME)
    : await createSID();

  return SID;
}

export function useSizebay() {
  return {
    initSZB,
    recommendedSize,
    sid,
  };
}
