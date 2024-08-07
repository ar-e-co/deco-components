import { formatPrice } from "deco-components/sdk/format.ts";
import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

import { useShippingOption } from "./ShippingOptionProvider.tsx";

const anatomy = [
  "value",
  "freeValue",
] as const;

type ShippingOptionPriceStyle = AnatomyClasses<typeof anatomy[number]>;

export type ShippingOptionPriceProps = {
  freeMessage?: string;
  classes?: ShippingOptionPriceStyle;
};

function ShippingOptionPrice({
  freeMessage = "Grátis",
  classes,
}: ShippingOptionPriceProps) {
  const option = useShippingOption();

  return (
    <p class={handleClasses("m-0", classes?.value)}>
      {formatPrice({ price: option.price }) ?? (
        <span class={classes?.freeValue ?? ""}>
          {freeMessage}
        </span>
      )}
    </p>
  );
}
export default ShippingOptionPrice;
