import { signal } from "@preact/signals";
import { getCookieSzb } from "deco-components/sdk/sizebay/cookie.ts";
import {
  createSID,
  SZB_COOKIE_NAME,
} from "deco-components/sdk/sizebay/fetcher.ts";

const visible = signal<boolean>(false);

function showSizebay() {
  visible.value = true;
}

function hideSizebay() {
  visible.value = false;
}

async function initSZB() {
  const SID = getCookieSzb(SZB_COOKIE_NAME)
    ? getCookieSzb(SZB_COOKIE_NAME)
    : await createSID();

  return SID;
}

export function useSizebay() {
  return {
    visible,
    showSizebay,
    hideSizebay,
    initSZB,
  };
}
