import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

import { formatMessage } from "../../../sdk/helpers.tsx";
import { useShippingOption } from "./ShippingOptionProvider.tsx";

const anatomy = [
  "value",
  "friendlyName",
] as const;

type ShippingOptionTitleStyle = AnatomyClasses<typeof anatomy[number]>;

export type ShippingOptionTitleProps = {
  message?: string;
  classes?: ShippingOptionTitleStyle;
};

function ShippingOptionTitle({
  message = "{{friendlyName}}",
  classes,
}: ShippingOptionTitleProps) {
  const option = useShippingOption();

  return (
    <p class={handleClasses("m-0", classes?.value)}>
      {formatMessage(message, {
        "{{friendlyName}}": {
          value: option.friendlyName ?? "",
          classes: classes?.friendlyName ?? "",
        },
      })}
    </p>
  );
}
export default ShippingOptionTitle;
