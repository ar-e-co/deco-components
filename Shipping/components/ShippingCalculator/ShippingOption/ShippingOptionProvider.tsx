import { createContext, JSX } from "preact";
import { useContext } from "preact/hooks";
import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

import { DeliverySla, PickupSla } from "../../../sdk/Types.ts";
import useShippingCalculator from "../../../sdk/useShippingCalculator.ts";

type ShippingOptionContextState = PickupSla | DeliverySla;

const ShippingOptionContext = createContext<ShippingOptionContextState>(
  null as never,
);

export function useShippingOption() {
  const context = useContext(ShippingOptionContext);

  if (!context) {
    throw new Error(
      "useShippingOption must be used within a ShippingOptionProvider",
    );
  }
  return context;
}

const anatomy = ["container", "container--active"] as const;

export type ShippingOptionProviderProps = {
  option: PickupSla | DeliverySla;
  children: JSX.Element | JSX.Element[];
  classes?: AnatomyClasses<typeof anatomy[number]>;
  onClick?: (_option: PickupSla | DeliverySla) => void;
};

function ShippingOptionProvider({
  option,
  children,
  classes,
  onClick,
}: ShippingOptionProviderProps) {
  const { selectedSlaSignal } = useShippingCalculator();
  const selectedSla = selectedSlaSignal.value;

  const isActive = selectedSla?.__id === option.__id;

  function handleClick() {
    onClick?.(option);
  }

  return (
    <ShippingOptionContext.Provider value={option}>
      <div
        class={handleClasses(
          classes?.container,
          isActive ? classes?.["container--active"] : "",
        )}
        onClick={handleClick}
      >
        {children}
      </div>
    </ShippingOptionContext.Provider>
  );
}

export default ShippingOptionProvider;
