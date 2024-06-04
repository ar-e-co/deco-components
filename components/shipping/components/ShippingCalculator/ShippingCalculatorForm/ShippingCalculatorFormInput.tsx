import { ChangeEvent } from "preact/compat";
import { useCart } from "apps/vtex/hooks/useCart.ts";

import { clx } from "deco-components/sdk/clx.ts";
import FormInput, {
  FormInputProps,
} from "deco-components/components/ui/FormInput.tsx";

import {
  maskPostalCode,
  stripNonNumericCharacters,
} from "../../../sdk/helpers.tsx";
import useShippingCalculator from "../../../sdk/useShippingCalculator.ts";
import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

const anatomy = ["container"];

export type ShippingCalculatorFormInputProps =
  & Omit<FormInputProps, "classes">
  & {
    classes?:
      & FormInputProps["classes"]
      & AnatomyClasses<typeof anatomy[number]>;
  };

function ShippingCalculatorFormInput({
  classes,
  ...props
}: ShippingCalculatorFormInputProps) {
  const { cart } = useCart();
  const { errorSignal, postalCodeSignal } = useShippingCalculator();

  const currentPostalCode = cart.value?.shippingData?.address?.postalCode;

  const error = errorSignal.value;
  const postalCode = postalCodeSignal.value ?? currentPostalCode ?? "";

  // blocks non numeric keys
  function handleKeypress(event: KeyboardEvent) {
    if (event.key !== "Enter" && !/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  function handleOnChange(event: ChangeEvent) {
    errorSignal.value = null;

    postalCodeSignal.value =
      stripNonNumericCharacters((event.target as HTMLInputElement)?.value) ??
        "";
  }

  return (
    <div class={handleClasses("inline-block", classes?.container)}>
      <FormInput
        {...props}
        class={handleClasses(
          "border border-transparent outline-none py-[calc(0.5rem-1px)] px-4",
          classes?.input,
          error ? clx("[&&]:border-red-500", classes?.["input--error"]) : "",
        )}
        name="postalCode"
        value={maskPostalCode(postalCode)}
        onChange={handleOnChange}
        onFocus={() => errorSignal.value = null}
        onKeyPress={handleKeypress}
        maxLength={9}
        error={error}
      />
    </div>
  );
}

export default ShippingCalculatorFormInput;
