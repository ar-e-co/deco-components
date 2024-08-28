import { useCart } from "apps/vtex/hooks/useCart.ts";

import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

import { DeliverySla } from "../../sdk/Types.ts";
import {
  calculateShippingEstimateDate,
  formatMessage,
  maskPostalCode,
  shippingEstimateToString,
} from "../../sdk/helpers.tsx";
import useShippingCalculator from "../../sdk/useShippingCalculator.ts";

const anatomy = [
  "message",
  "defaultMessage",
  "dueDate",
  "estimate",
  "postalCode",
  "pickupOptionName",
] as const;

export type EstimateInfoAnatomyKeys = typeof anatomy[number];

type EstimateInfoClasses = AnatomyClasses<EstimateInfoAnatomyKeys>;

export type SelectedShippingProps = {
  defaultMessage?: string;
  deliveryMessage?: string;
  pickupMessage?: string;
  deliveryOnTheSameDayMessage?: string;
  classes?: EstimateInfoClasses;
};

function SelectedShipping({
  defaultMessage = "Entrega",
  deliveryMessage = "Até {{dueDate}} para {{postalCode}}",
  pickupMessage = "Retirar em {{friendlyName}}",
  deliveryOnTheSameDayMessage = "No mesmo dia para {{postalCode}}",
  classes,
}: SelectedShippingProps) {
  const { cart } = useCart();
  const { selectedSlaSignal } = useShippingCalculator();

  const postalCode = cart.value?.shippingData?.address?.postalCode;

  const selectedSla = selectedSlaSignal.value;
  const isPickup = selectedSla?.selectedDeliveryChannel === "pickup-in-point";

  const formattedPickupMessage = isPickup
    ? formatMessage(pickupMessage, {
      "{{friendlyName}}": {
        value: (selectedSla as DeliverySla)?.friendlyName,
        classes: classes?.pickupOptionName ?? "",
      },
    })
    : null;

  const formattedDeliveryMessage = (function () {
    const estimate = selectedSla?.shippingEstimate;

    if (!estimate || !postalCode) {
      return null;
    }

    let dueDate = "";
    let estimateString = "";

    const deliveryToday = estimate === "0d" || estimate === "0bd" ||
      estimate.includes("h");

    const message = deliveryToday
      ? deliveryOnTheSameDayMessage
      : deliveryMessage;

    if (message.includes("{{dueDate}}")) {
      const { day, monthName } = calculateShippingEstimateDate(estimate);
      dueDate = `${day} de ${monthName}`;
    }

    if (message.includes("{{estimate}}")) {
      estimateString = shippingEstimateToString(estimate);
    }

    return formatMessage(message, {
      "{{dueDate}}": {
        value: dueDate,
        classes: classes?.dueDate ?? "",
      },

      "{{estimate}}": {
        value: estimateString,
        classes: classes?.estimate ?? "",
      },

      "{{postalCode}}": {
        value: maskPostalCode(postalCode),
        classes: classes?.postalCode ?? "",
      },
    });
  })();

  function renderValue() {
    if (isPickup) {
      return formattedPickupMessage;
    }

    return formattedDeliveryMessage;
  }

  return (
    <p
      class={handleClasses(
        "m-0 mr-1.5",
        selectedSla ? classes?.defaultMessage : classes?.message,
      )}
    >
      {selectedSla ? renderValue() : defaultMessage}
    </p>
  );
}

export default SelectedShipping;
