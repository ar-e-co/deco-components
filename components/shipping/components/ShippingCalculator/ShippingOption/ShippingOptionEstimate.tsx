import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

import {
  calculateShippingEstimateDate,
  formatMessage,
  shippingEstimateToString,
} from "../../../sdk/helpers.tsx";

import { useShippingOption } from "./ShippingOptionProvider.tsx";

const anatomy = [
  "value",
  "dueDate",
  "estimate",
] as const;

export type EstimateInfoStyle = AnatomyClasses<typeof anatomy[number]>;

export type ShippingOptionEstimateProps = {
  message?: string;
  sameDayEstimateMessage?: string;
  classes?: EstimateInfoStyle;
};

function ShippingOptionEstimate({
  message: messageProp = "Até {{dueDate}}",
  sameDayEstimateMessage = "No mesmo dia",
  classes,
}: ShippingOptionEstimateProps) {
  const option = useShippingOption();

  function renderMessage() {
    const estimate = option.shippingEstimate;

    let dueDate = "";
    let estimateString = "";

    const deliveryToday = estimate === "0d" || estimate === "0bd" ||
      estimate.includes("h");

    const message = deliveryToday ? sameDayEstimateMessage : messageProp;

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
    });
  }

  return (
    <p class={handleClasses("m-0", classes?.value)}>
      {renderMessage()}
    </p>
  );
}

export default ShippingOptionEstimate;
