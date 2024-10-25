import { computed, Signal, signal } from "@preact/signals";
import { state as storeState } from "apps/vtex/hooks/context.ts";

import calculatePickupOptions from "./pickupOptions.ts";
import calculateCheapestAndFastestDeliveryOptions from "./deliveryOptions.ts";

import {
  DeliverySla,
  PickupSla,
  PostalCode,
  SelectedDeliveryChannel,
  SelectedSla,
} from "./Types.ts";
import {
  CHEAPEST_DELIVERY_ID,
  LOCAL_STORAGE_ACTIVE_DELIVERY_CHANNEL_KEY,
  LOCAL_STORAGE_ACTIVE_DELIVERY_OPTION_KEY,
} from "./constants.ts";
import { stripNonNumericCharacters } from "deco-components/components/shipping/sdk/helpers.tsx";

export type ShippingCalculatorContextState = {
  // Computed
  hasSelectedAddress: boolean;
  selectedSlaSignal: Signal<SelectedSla | null>;
  deliveryOptionsSignal: Signal<{
    deliveryOptions: DeliverySla[];
    fastestDeliveryOption: DeliverySla | null;
    cheapestDeliveryOption: DeliverySla | null;
    unavailableItemsForDelivery: number[];
  }>;
  pickupOptionsSignal: Signal<{
    pickupOptions: PickupSla[];
    unavailableItemsForPickup: number[];
  }>;
  // Form
  postalCodeSignal: Signal<PostalCode | null>;
  errorSignal: Signal<string | null>;
  loadingSignal: Signal<boolean>;
};

// One cart to rule them all
const { cart } = storeState;

// Mutable signals must be declared outside the hook
const postalCodeSignal = signal<PostalCode | null>(null);
const errorSignal = signal<string | null>(null);
const loadingSignal = signal<boolean>(false);

const hasSelectedAddressSignal = computed(() => {
  const shippingData = cart.value?.shippingData;
  const postalCode = stripNonNumericCharacters(
    shippingData?.address?.postalCode ?? "",
  );
  const isValid = postalCode.length === 8;

  return isValid;
});

const pickupOptionsSignal = computed(() => {
  const logisticsInfo = cart.value?.shippingData?.logisticsInfo ?? [];

  return calculatePickupOptions(logisticsInfo);
});

const deliveryOptionsSignal = computed(() => {
  const logisticsInfo = cart.value?.shippingData?.logisticsInfo ?? [];

  return calculateCheapestAndFastestDeliveryOptions(logisticsInfo);
});

const selectedSlaSignal = computed(() => {
  const logisticsInfo = cart.value?.shippingData?.logisticsInfo ?? [];

  const { pickupOptions = [] } = pickupOptionsSignal.value ?? {};
  const { deliveryOptions = [] } = deliveryOptionsSignal.value ?? {};

  // Returns string, so null coalescing operator does not work
  const activeDeliveryChannel =
    localStorage.getItem(LOCAL_STORAGE_ACTIVE_DELIVERY_CHANNEL_KEY) ||
    SelectedDeliveryChannel.Delivery;

  const activeDeliveryOption =
    localStorage.getItem(LOCAL_STORAGE_ACTIVE_DELIVERY_OPTION_KEY) ||
    CHEAPEST_DELIVERY_ID;

  if (activeDeliveryChannel === SelectedDeliveryChannel.PickupInPoint) {
    const pickupPointId = logisticsInfo?.find(
      (d) =>
        d.selectedDeliveryChannel === SelectedDeliveryChannel.PickupInPoint,
    )?.selectedSla ?? "";

    const pickupPoint = pickupOptions.find((d) => d.__id === pickupPointId);

    return pickupPoint ?? null;
  }

  const [cheapest, fastest] = deliveryOptions;

  return activeDeliveryOption === CHEAPEST_DELIVERY_ID
    ? cheapest ?? null
    : fastest ?? cheapest ?? null; // Sometimes the cheapest option is also the fastest
});

const state: ShippingCalculatorContextState = {
  // Computed
  selectedSlaSignal,
  pickupOptionsSignal,
  deliveryOptionsSignal,
  hasSelectedAddress: hasSelectedAddressSignal.value,

  // Form
  postalCodeSignal,
  errorSignal,
  loadingSignal,
};

export function useShippingCalculator() {
  return state;
}

export default useShippingCalculator;
