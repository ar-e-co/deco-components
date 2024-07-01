import { fetchAPI } from "apps/utils/fetch.ts";

export interface PickupPoint {
  friendlyName: string;
  address: Address;
  additionalInfo: string | null;
  id: string;
  workingDays: WorkingDays[];
  businessHours: WorkingDays[];
  __typename: string;
}


export interface Address {
  addressType: string;
  receiverName: string | null;
  addressId: string;
  isDisposable: boolean;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  reference: string | null;
  geoCoordinates: GeoCoordinates;
  __typename: string;
}

export type GeoCoordinates = [number, number];

export interface WorkingDays {
  DayOfWeek: number;
  OpeningTime: string;
  ClosingTime: string;
  __typename: string;
}


export default async function getStorePickupPoints(
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
