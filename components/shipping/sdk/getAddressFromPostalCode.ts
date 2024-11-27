import { useCart } from "apps/vtex/hooks/useCart.ts";
import { OrderFormItem } from "apps/vtex/utils/types.ts";

import { invoke } from "deco-components/runtime.ts";

import { Address, SelectedDeliveryChannel } from "./Types.ts";
import {
  CHEAPEST_DELIVERY_ID,
  LOCAL_STORAGE_ACTIVE_DELIVERY_CHANNEL_KEY,
  LOCAL_STORAGE_ACTIVE_DELIVERY_OPTION_KEY,
  LOCAL_STORAGE_ADDITIONAL_SHIPPING_DATA_KEY,
  LOCAL_STORAGE_ADDITIONAL_SHIPPING_DATA_VALUE,
} from "./constants.ts";
import { stripNonNumericCharacters } from "deco-components/components/shipping/sdk/helpers.tsx";

async function sendPostalCodeAttachment(postalCode: string) {
  try {
    const { cart, sendAttachment } = useCart();
    const availableAddresses = cart.value?.shippingData?.availableAddresses ??
      [];

    // remove all non-numeric characters
    if (stripNonNumericCharacters(postalCode).length !== 8) {
      throw new Error("CEP inválido");
    }

    const address: Address = await invoke["deco-components"].actions
      .getAddressFromPostalCode({
        postalCode,
        availableAddresses,
      });

    if (!address?.addressId) {
      throw new Error("Endereço não encontrado");
    }

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
  } catch (error) {
    console.error(error);
  }
}

export default sendPostalCodeAttachment;
