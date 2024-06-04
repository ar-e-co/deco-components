import { ChangeEvent } from "preact/compat";

import FormInput, {
  FormInputProps,
} from "deco-components/components/ui/FormInput.tsx";

import {
  maskPostalCode,
  stripNonNumericCharacters,
} from "../../sdk/helpers.tsx";
import useShippingSimulation from "../../sdk/useShippingSimulation.ts";
import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

const anatomy = ["container"];

export type ShippingSimulationFormInputProps =
  & Omit<FormInputProps, "classes">
  & {
    classes?:
      & FormInputProps["classes"]
      & AnatomyClasses<typeof anatomy[number]>;
  };

function ShippingSimulationFormInput({
  classes,
  ...props
}: ShippingSimulationFormInputProps) {
  const { errorSignal, postalCodeSignal } = useShippingSimulation();

  const error = errorSignal.value;
  const postalCode = postalCodeSignal.value ?? "";

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
        classes={{
          ...classes,
          input: handleClasses(
            "bg-gray-100 rounded-full px-4 join-item w-full border border-transparent outline-none",
            classes?.input,
          ),
        }}
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

export default ShippingSimulationFormInput;
