import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

import { calculateShippingEstimateDate } from "../../sdk/helpers.tsx";

type DisplaySla = {
  name: string;
  shippingEstimate: string;
  price: number;
  storeNames?: string[];
  isPickup?: boolean;
};

const anatomy = [
  "container",
  "tooltip",
  "text",
] as const;

export type EstimateInfoStyle = AnatomyClasses<typeof anatomy[number]>;

export type ShippingOptionEstimateProps = {
  method: DisplaySla
  classes?: EstimateInfoStyle;
};
export default function   ({ method, classes }: ShippingOptionEstimateProps) {
  const { day, monthName, dayName } = calculateShippingEstimateDate(
    method.shippingEstimate,
  );
  const message = `Até ${dayName}, ${day} de ${monthName}`;
  const storeList = method.storeNames?.map((store) => (
    <li class="text-xs">{store}</li>
  ));
  return (
    <span class={handleClasses(classes?.container) || "text-button text-start lg:text-center"}>
      {message}
      {method.isPickup
        ? (
          <span class="">
            em{" "}
            <span class={handleClasses(classes?.text) || `font-bold underline dropdown dropdown-hover`}>
              {method.storeNames?.length}{" "}
              loja{method.storeNames?.length! > 1 ? "s " : " "}
              <ul class={handleClasses(classes?.tooltip) || "dropdown-content min-w-[150px] w-auto rounded-2xl bg-slate-950 text-white py-2 px-2  z-10" }>
                {storeList}
              </ul>
            </span>
          </span>
        )
        : null}
    </span>
  );
}
