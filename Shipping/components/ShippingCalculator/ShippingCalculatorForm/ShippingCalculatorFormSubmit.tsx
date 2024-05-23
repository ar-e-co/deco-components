import { ComponentChildren, JSX } from "preact";

import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";
import Spinner from "deco-components/components/ui/Spinner.tsx";

import useShippingCalculator from "../../../sdk/useShippingCalculator.ts";

const anatomy = ["button", "button-disabled"] as const;

export type ShippingCalculatorFormSubmitStyles = AnatomyClasses<
  typeof anatomy[number]
>;

export type ShippingCalculatorFormSubmitProps =
  & Partial<JSX.HTMLAttributes<HTMLButtonElement>>
  & {
    children?: ComponentChildren;
    classes?: ShippingCalculatorFormSubmitStyles;
  };

function ShippingCalculatorFormSubmit({
  children = "Enviar",
  classes,
  ...props
}: ShippingCalculatorFormSubmitProps) {
  const { loadingSignal } = useShippingCalculator();
  const loading = loadingSignal.value;

  return (
    <button
      {...props}
      type="submit"
      class={handleClasses(
        "inline-block h-fit py-2 px-6 bg-primary disabled:bg-gray-300",
        classes?.button,
      )}
      disabled={loading}
    >
      {loading ? <Spinner size={16} /> : children}
    </button>
  );
}

export default ShippingCalculatorFormSubmit;
