import { JSX } from "preact";
import { ChangeEvent } from "preact/compat";
import { useEffect } from "preact/hooks";
import { useCart } from "apps/vtex/hooks/useCart.ts";

import { clx } from "deco-components/sdk/clx.ts";
import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

import {
  maskPostalCode,
  stripNonNumericCharacters,
} from "../../../sdk/helpers.tsx";
import useShippingCalculator from "../../../sdk/useShippingCalculator.ts";

const anatomy = [
  "container",
  "input",
  "input--error",
  "errorMessage",
] as const;

export type ShippingCalculatorFormInputStyles = AnatomyClasses<
  typeof anatomy[number]
>;

export type ShippingCalculatorFormInputProps =
  & JSX.HTMLAttributes<HTMLInputElement>
  & {
    classes?: ShippingCalculatorFormInputStyles;
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

  useEffect(() => {
  }, []);

  return (
    <div class={handleClasses("inline-block", classes?.container)}>
      <input
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
      />

      {!!error && (
        <span
          class={handleClasses(
            "block mt-0.5 text-sm text-red-500",
            classes?.errorMessage,
          )}
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default ShippingCalculatorFormInput;
