import { fetchAPI } from "apps/utils/fetch.ts";

export async function getStorePickupPoints(
  accountName: string,
  postalCode: string,
) {
  const url =
    `https://${accountName}.vtexcommercestable.com.br/api/checkout/pub/pickup-points?postalCode=${postalCode}&countryCode=BRA&pageSize=1`;
  const { items = [] }: any = await fetchAPI(url); // TIPAR
  const pickupPoint = items[0]?.pickupPoint;

  if (!pickupPoint) {
    return null;
  }

  return {
    ...pickupPoint,
    workingDays: pickupPoint?.businessHours ?? [],
  };
}
