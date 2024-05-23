import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";
import { formatPrice } from "deco-components/sdk/format.ts";

const anatomy = [
  "container",
] as const;

export type EstimateInfoStyle = AnatomyClasses<typeof anatomy[number]>;

export type ShippingOptionEstimateProps = {
  price: number;
  currencyCode: string;
  locale: string;
  classes?: EstimateInfoStyle;
};

 export default function MethodPrice({ price,currencyCode,locale, classes }: ShippingOptionEstimateProps) {
    return (
      <span class={handleClasses(classes?.container)}>
        {price === 0 ? "Grátis" : (
          formatPrice(price / 100, currencyCode, locale)
        )}
      </span>
    );
  }

  