import { useCart } from "apps/vtex/hooks/useCart.ts";
import { OrderFormItem } from "apps/vtex/utils/types.ts";

import { invoke } from "deco-components/runtime.ts";

import { SelectedDeliveryChannel } from "./Types.ts";
import {
  CHEAPEST_DELIVERY_ID,
  LOCAL_STORAGE_ACTIVE_DELIVERY_CHANNEL_KEY,
  LOCAL_STORAGE_ACTIVE_DELIVERY_OPTION_KEY,
  LOCAL_STORAGE_ADDITIONAL_SHIPPING_DATA_KEY,
  LOCAL_STORAGE_ADDITIONAL_SHIPPING_DATA_VALUE,
} from "./constants.ts";

async function sendPostalCodeAttachment(postalCode: string) {
  const { cart, sendAttachment } = useCart();
  const availableAddresses = cart.value?.shippingData?.availableAddresses ?? [];

  // remove all non-numeric characters
  if (postalCode?.replace(/\D/g, "").length < 8) {
    throw new Error("CEP inválido");
  }

  const address = await invoke["deco-components"].actions
    .getAddressFromPostalCode({
      postalCode,
      availableAddresses,
    });

  // Everytime we change the address, it chooses the cheapest delivery option
  // by default, hence we need to reset the localStorage values
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
      selectedAddresses: [{ ...address, addressType: "residential" }],
      logisticsInfo: cart.value?.items.map((
        _: OrderFormItem,
        itemIndex: number,
      ) => ({
        itemIndex: String(itemIndex),
        addressId: address.addressId,
        selectedSla: null,
        selectedDeliveryChannel: null,
      })),
    },
  });
}

export default sendPostalCodeAttachment;
