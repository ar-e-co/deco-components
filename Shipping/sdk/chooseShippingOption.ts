import { useCart } from "apps/vtex/hooks/useCart.ts";

import { useShippingCalculator } from "./useShippingCalculator.ts";
import { DeliveryTypes, SelectedDeliveryChannel } from "./Types.ts";

import {
  CHEAPEST_DELIVERY_ID,
  LOCAL_STORAGE_ACTIVE_DELIVERY_CHANNEL_KEY,
  LOCAL_STORAGE_ACTIVE_DELIVERY_OPTION_KEY,
  LOCAL_STORAGE_ADDITIONAL_SHIPPING_DATA_KEY,
  LOCAL_STORAGE_ADDITIONAL_SHIPPING_DATA_VALUE,
} from "./constants.ts";

export async function clearShippingOptions() {
  const { loadingSignal } = useShippingCalculator();
  const { cart, sendAttachment } = useCart();

  try {
    loadingSignal.value = true;

    // It's important to update the localStorage before sending the attachment
    // for then we can get the correct computed values after the attachment is sent
    localStorage.setItem(
      LOCAL_STORAGE_ACTIVE_DELIVERY_CHANNEL_KEY,
      SelectedDeliveryChannel.Delivery,
    );

    localStorage.setItem(
      LOCAL_STORAGE_ACTIVE_DELIVERY_OPTION_KEY,
      CHEAPEST_DELIVERY_ID,
    );

    localStorage.setItem(
      LOCAL_STORAGE_ADDITIONAL_SHIPPING_DATA_KEY,
      LOCAL_STORAGE_ADDITIONAL_SHIPPING_DATA_VALUE,
    );

    await sendAttachment({
      attachment: "shippingData",
      body: {
        selectedAddresses: [],
        logisticsInfo: cart.value?.items.map((_: unknown, index: number) => ({
          itemIndex: index,
          addressId: null,
          selectedSla: null,
          selectedDeliveryChannel: null,
        })),
      },
    });
  } finally {
    loadingSignal.value = false;
  }
}

export async function chooseShippingOption({
  deliveryChannel,
  deliveryOption,
  slas,
}: {
  slas: Array<string | number>;
  deliveryChannel: SelectedDeliveryChannel;
  deliveryOption?: DeliveryTypes | null;
}) {
  const { loadingSignal } = useShippingCalculator();
  const { cart, sendAttachment } = useCart();

  const address = cart.value?.shippingData?.address;

  try {
    loadingSignal.value = true;

    // It's important to update the localStorage before sending the attachment
    // for then we can get the correct computed values when the attachment is sent
    // Also, these steps are necessary for VTEX Checkout
    localStorage.setItem(
      LOCAL_STORAGE_ACTIVE_DELIVERY_CHANNEL_KEY,
      deliveryChannel,
    );

    if (deliveryOption) {
      localStorage.setItem(
        LOCAL_STORAGE_ACTIVE_DELIVERY_OPTION_KEY,
        deliveryOption,
      );

      const lsShippingData =
        localStorage.getItem(LOCAL_STORAGE_ADDITIONAL_SHIPPING_DATA_KEY) ??
          LOCAL_STORAGE_ADDITIONAL_SHIPPING_DATA_VALUE;

      localStorage.setItem(
        LOCAL_STORAGE_ADDITIONAL_SHIPPING_DATA_KEY,
        lsShippingData.replace(/CHEAPEST|FASTEST/g, deliveryOption),
      );
    }

    await sendAttachment({
      attachment: "shippingData",
      body: {
        selectedAddresses: [{
          ...address,
          isDisposable: false,
          addressType: deliveryChannel === SelectedDeliveryChannel.Delivery
            ? "residential"
            : "search",
        }],
        logisticsInfo: slas.map((slaId, index) => ({
          itemIndex: index,
          addressId: address?.addressId,
          selectedSla: slaId,
          selectedDeliveryChannel: deliveryChannel,
        })),
      },
    });
  } catch (err) {
    // In case of error is best to clear the shipping options
    await clearShippingOptions();
    throw err;
  } finally {
    loadingSignal.value = false;
  }
}
