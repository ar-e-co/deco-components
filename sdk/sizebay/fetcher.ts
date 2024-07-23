import { setCookie } from "./cookie.ts";
import { APP_URL } from "./constants.ts";

export const SZB_COOKIE_NAME = "SIZEBAY_SESSION_ID_V4";

async function fetcher(url: string) {
  const res = await fetch(`${APP_URL}${url}`, {
    method: "GET",
  });

  if (res?.ok) {
    return await res.json();
  }

  console.error("Product not found");
  return;
}

export async function createSID() {
  const szbSID = await fetcher("api/me/session-id");
  setCookie(SZB_COOKIE_NAME, szbSID);
  return szbSID;
}

export type ProductConfig = {
  mixMatch: boolean;
  id: string;
  accessory: boolean;
  clothesType: "TOP" | "BOTTOM" | "SHOES" | "ACCESSORY"; // checar tipo
  shoe: boolean;
};

export async function getSZBProduct(
  SID: string,
  permalink: string,
): Promise<ProductConfig> {
  const getProd = await fetcher(
    `plugin/my-product-id?sid=${SID}&permalink=${permalink}`,
  );

  return getProd;
}

export type SZBRecommendation = {
  recommendedSize: string;
};

export async function getSZBRecommendation(
  productId: string,
  SID: string,
  tenantId: number,
): Promise<SZBRecommendation> {
  const getRec = await fetcher(
    `api/me/analysis/${productId}?sid=${SID}&tenant=${tenantId}`,
  );

  return getRec;
}
