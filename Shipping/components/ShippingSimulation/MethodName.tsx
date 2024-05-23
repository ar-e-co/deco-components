import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

const anatomy = [
  "container",
] as const;

export type EstimateInfoStyle = AnatomyClasses<typeof anatomy[number]>;

export type ShippingOptionEstimateProps = {
  method: DisplaySla
  classes?: EstimateInfoStyle;
};
  type DisplaySla = {
    name: string;
    shippingEstimate: string;
    price: number;
    storeNames?: string[];
    isPickup?: boolean;
  };
  
 export default function MethodName({ method, classes }: ShippingOptionEstimateProps) {
    return (
      <span class={handleClasses(classes?.container) || "text-button text-start lg:text-center"}>
        {method.name}
      </span>
    );
  }

  