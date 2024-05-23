import {
  getFastestSla,
  getLatestSla,
  selectCheapestSlaForAllItems,
  selectFastestSlaForAllItems,
} from "@vtex/estimate-calculator";

import type { DeliverySla, LogisticsInfo } from "./Types.ts";
import { SelectedDeliveryChannel } from "./Types.ts";

import {
  CHEAPEST_DELIVERY_ID,
  CHEAPEST_DELIVERY_NAME,
  FASTEST_DELIVERY_ID,
  FASTEST_DELIVERY_NAME,
} from "./constants.ts";

import { computeId, computePrice } from "./helpers.tsx";

function calculateCheapestAndFastestDeliveryOptions(
  logisticsInfo: LogisticsInfo[],
) {
  const cheapestOptions =
    ((selectCheapestSlaForAllItems(logisticsInfo) ?? []) as LogisticsInfo[])
      .map((option) => ({
        ...option,
        selectedSlaValue:
          option.slas.find((d) => d.id === option.selectedSla) ?? null,
      }));

  const fastestOptions =
    ((selectFastestSlaForAllItems(logisticsInfo) ?? []) as LogisticsInfo[])
      .map((option) => ({
        ...option,
        selectedSlaValue:
          option.slas.find((d) => d.id === option.selectedSla) ?? null,
      }));

  if (!cheapestOptions.length || !fastestOptions.length) {
    return {
      cheapestDeliveryOption: null,
      fastestDeliveryOption: null,
      unavailableItemsForDelivery: [],
      deliveryOptions: [],
    };
  }

  const unavailableItemsForDelivery = [...cheapestOptions, ...fastestOptions]
    .map((option) => {
      if (option.selectedSlaValue) {
        return null;
      }

      return Number(option.itemIndex);
    })
    .filter((d, v, a) => d !== null && a.indexOf(d) === v) as number[];

  const noItemAvailableForCheapest = cheapestOptions.every((d) =>
    !d.selectedSla
  );
  const noItemAvailableForFastest = fastestOptions.every((d) => !d.selectedSla);

  let cheapestDeliveryOption: DeliverySla | null = null;
  let fastestDeliveryOption: DeliverySla | null = null;

  if (!noItemAvailableForCheapest) {
    const slowestCheapestEstimate = getLatestSla(cheapestOptions);

    cheapestDeliveryOption = {
      __id: computeId(cheapestOptions.map((d) => d.selectedSlaValue?.id ?? "")),
      __type: CHEAPEST_DELIVERY_ID,
      friendlyName: CHEAPEST_DELIVERY_NAME,
      selectedDeliveryChannel: SelectedDeliveryChannel.Delivery,
      slas: cheapestOptions.map((logisticsInfo) =>
        logisticsInfo.selectedSlaValue
      ),
      shippingEstimate:
        slowestCheapestEstimate?.selectedSlaValue?.shippingEstimate ?? "",
      price: computePrice(
        cheapestOptions.map((d) => d.selectedSlaValue?.price ?? 0),
      ),
    };
  }

  if (!noItemAvailableForFastest) {
    const slowestFastestEstimate = getFastestSla(fastestOptions);

    fastestDeliveryOption = {
      __id: computeId(fastestOptions.map((d) => d.selectedSlaValue?.id ?? "")),
      __type: FASTEST_DELIVERY_ID,
      friendlyName: FASTEST_DELIVERY_NAME,
      selectedDeliveryChannel: SelectedDeliveryChannel.Delivery,
      slas: fastestOptions.map((logisticsInfo) =>
        logisticsInfo.selectedSlaValue
      ),
      shippingEstimate:
        slowestFastestEstimate?.selectedSlaValue?.shippingEstimate ?? "",
      price: computePrice(
        fastestOptions.map((d) => d.selectedSlaValue?.price ?? 0),
      ),
    };
  }

  const deliveryOptions: DeliverySla[] = (function deliveryOptions() {
    if (!fastestDeliveryOption || !cheapestDeliveryOption) {
      return [];
    }

    // if the fastestDeliveryOption SLA is the same price as the
    // cheapestDeliveryOption, we only show the fastestDeliveryOption SLA
    if (
      (fastestDeliveryOption.price ?? 0) === (cheapestDeliveryOption.price ?? 0)
    ) {
      return [
        {
          ...fastestDeliveryOption,
          __id: cheapestDeliveryOption.__id,
          friendlyName: cheapestDeliveryOption?.friendlyName,
        },
      ];
    }

    if (
      fastestDeliveryOption?.shippingEstimate ===
        cheapestDeliveryOption.shippingEstimate
    ) {
      return [cheapestDeliveryOption];
    }

    return [cheapestDeliveryOption, fastestDeliveryOption];
  })();

  return {
    deliveryOptions,
    cheapestDeliveryOption,
    fastestDeliveryOption,
    unavailableItemsForDelivery,
  };
}

export default calculateCheapestAndFastestDeliveryOptions;
