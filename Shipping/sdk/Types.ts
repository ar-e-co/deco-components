import {
  Address,
  LogisticsInfo as NativeLogisticsInfo,
  PickupStoreInfo,
  SelectedDeliveryChannel,
  Sla as ShippingSla,
} from "apps/vtex/utils/types.ts";

export type { Address, PickupStoreInfo, ShippingSla };
export { SelectedDeliveryChannel };

export type LogisticsInfo = NativeLogisticsInfo & {
  selectedSlaValue?: ShippingSla | null;
};

export type AddressType =
  | "residential"
  | "commercial"
  | "inStore"
  | "giftRegistry"
  | "pickup"
  | "search"
  | "pickup-in-point";

export type DeliveryTypes = "CHEAPEST" | "FASTEST";

export type ShippingOptionType = {
  id: string;
  price: number;
  friendlyName: string;
  shippingEstimate: string;
  shippingEstimateValue: number;
  type: AddressType;
};

export type DeliverySla = {
  __id: string;
  __type: DeliveryTypes;
  friendlyName: string;
  slas: Array<ShippingSla | null>;
  selectedDeliveryChannel: SelectedDeliveryChannel;
  shippingEstimate: string;
  price: number;
  packages?: number;
  unavailableItems?: number[];
};

export type PickupSla = PickupStoreInfo & {
  __id: string;
  __type: null;
  pickupPointId: string;
  unavailableItems?: number[];
  price: number;
  shippingEstimate: string;
  selectedDeliveryChannel: SelectedDeliveryChannel.PickupInPoint;
  slas: Array<ShippingSla | null>;
};

export type SelectedSla = DeliverySla | PickupSla;

export type PostalCode = string;
