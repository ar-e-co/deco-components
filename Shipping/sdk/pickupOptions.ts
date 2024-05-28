import { getLatestSla } from "@vtex/estimate-calculator";

import { computePrice } from "./helpers.tsx";
import type {
  LogisticsInfo,
  PickupSla,
  PickupStoreInfo,
  ShippingSla,
} from "./Types.ts";
import { SelectedDeliveryChannel } from "./Types.ts";

type StoreItem = PickupStoreInfo & {
  pickupPointId: string;
  slas: Array<ShippingSla & { itemIndex: number }>;
  items: number[];
  prices: number[];
};

function calculatePickupOptions(logisticsInfo: LogisticsInfo[]) {
  const stores: Record<string, StoreItem> = {};

  const pickupSlasForEachItem = logisticsInfo.map((info) =>
    info.slas?.filter(
      (sla) => sla.deliveryChannel === SelectedDeliveryChannel.PickupInPoint,
    )
  );

  // Group the pickup options by pickup point
  pickupSlasForEachItem.forEach((slasForItem, i) => {
    slasForItem.forEach((sla) => {
      const { pickupPointId } = sla;

      if (!pickupPointId) {
        return;
      }

      stores[pickupPointId] = {
        ...sla.pickupStoreInfo,
        pickupPointId,
        slas: [...stores?.[pickupPointId]?.slas ?? [], {
          ...sla,
          itemIndex: i,
        }],
        items: [...stores?.[pickupPointId]?.items ?? [], i],
        prices: [...stores?.[pickupPointId]?.prices ?? [], sla.price],
      };
    });
  });

  // convert the stores object to an array
  const pickupOptions = Object.keys(stores).map((key) => {
    const store = stores[key];
    const slowestSla: ShippingSla = getLatestSla(store.slas);

    return {
      ...store,
      __id: store.slas[0].id,
      __type: null,
      // Some items may not have a pickup option, so we need to add nulls to the array
      slas: logisticsInfo
        .map(({ itemIndex }) =>
          store.slas.find((sla) => sla.itemIndex === itemIndex) ?? null
        ),
      price: computePrice(store.prices),
      shippingEstimate: slowestSla?.shippingEstimate,
      selectedDeliveryChannel: SelectedDeliveryChannel.PickupInPoint,
    };
  }) as PickupSla[];

  // returns an array of indexes of items that have no pickup options
  const unavailableItemsForPickup = pickupSlasForEachItem.reduce(
    (
      acc,
      availableSlas,
      i,
    ) => (availableSlas?.length === 0 ? [...acc, i] : acc),
    [] as number[],
  );

  return {
    pickupOptions,
    unavailableItemsForPickup,
  };
}

export default calculatePickupOptions;
