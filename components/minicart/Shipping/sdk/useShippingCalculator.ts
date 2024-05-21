import { computed, Signal, signal } from "@preact/signals";
import { state as storeState } from "apps/vtex/hooks/context.ts";
import type { SimulationOrderForm } from "apps/vtex/utils/types.ts";

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
  postalCode: Signal<PostalCode | null>
  simulateResult: Signal<SimulationOrderForm | null>
};

// Mutable signals must be declared outside the hook
const postalCodeSignal = signal<PostalCode | null>(null);
const errorSignal = signal<string | null>(null);
const loadingSignal = signal<boolean>(false);
const postalCode = signal<PostalCode | null>('');
const simulateResult = signal<SimulationOrderForm | null>(null);


const { cart } = storeState;

const hasSelectedAddressSignal = computed(() => {
  const shippingData = cart.value?.shippingData;

  return Boolean(shippingData?.address?.postalCode);
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
  postalCode,
  simulateResult,
};

export function useShippingCalculator() {
  return state;
}

export default useShippingCalculator;
