import { setCookie } from "./cookie.ts";
import { APP_URL } from "./constants.ts";

export const SZB_COOKIE_NAME = "SIZEBAY_SESSION_ID_V4";

async function fetcher<T>(url: string): Promise<T | null> {
  const res = await fetch(`${APP_URL}${url}`, {
    method: "GET",
  });

  if (res?.ok) {
    return await res.json() as T;
  }

  console.error("Product not found");
  return null;
}

export async function createSID() {
  const szbSID = await fetcher<string>("api/me/session-id");
  setCookie(SZB_COOKIE_NAME, szbSID ?? "");
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
  SID: string | null,
  permalink: string,
): Promise<ProductConfig | null> {
  if (!SID) {
    console.error("SID not found");
    return null;
  }

  const getProd = await fetcher<ProductConfig>(
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
): Promise<SZBRecommendation | null> {
  const getRec = await fetcher<SZBRecommendation>(
    `api/me/analysis/${productId}?sid=${SID}&tenant=${tenantId}`,
  );

  return getRec;
}
