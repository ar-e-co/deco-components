import { ComponentChildren } from "preact";

import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

import sendPostalCodeAttachment from "../../../sdk/getAddressFromPostalCode.ts";
import useShippingCalculator from "../../../sdk/useShippingCalculator.ts";

const anatomy = [
  "container",
] as const;

export type ShippingCalculatorFormStyles = AnatomyClasses<
  typeof anatomy[number]
>;

export type ShippingCalculatorFormProps = {
  children: ComponentChildren;
  errorMessage?: string;
  classes?: ShippingCalculatorFormStyles;
};

function ShippingCalculatorForm({
  children,
  errorMessage = "CEP inválido",
  classes,
}: ShippingCalculatorFormProps) {
  const { postalCodeSignal, errorSignal, loadingSignal } =
    useShippingCalculator();

  async function handleSubmit(e?: Event) {
    e?.preventDefault();
    loadingSignal.value = true;

    try {
      const postalCode = postalCodeSignal.value ?? "";
      await sendPostalCodeAttachment(postalCode);
    } catch {
      errorSignal.value = errorMessage;
    } finally {
      loadingSignal.value = false;
    }
  }

  return (
    <form
      class={handleClasses("block", classes?.container)}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
}

export default ShippingCalculatorForm;
