import { ComponentChildren } from "preact";

import { SKU } from "apps/vtex/utils/types.ts";
import { useCart } from "apps/vtex/hooks/useCart.ts";

import { invoke } from "deco-components/runtime.ts";
import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

import { useShippingSimulation } from "../../sdk/useShippingSimulation.ts";
import { stripNonNumericCharacters } from "deco-components/components/shipping/sdk/helpers.tsx";

const anatomy = ["container"] as const;

type Styles = AnatomyClasses<typeof anatomy[number]>;

export interface Props {
  classes?: Styles;
  items: Array<SKU>;
  children: ComponentChildren;
}

function FormSimulation({
  items,
  classes,
  children,
}: Props) {
  const { cart } = useCart();

  const {
    postalCodeSignal,
    simulationResultSignal,
    loadingSignal,
    errorSignal,
  } = useShippingSimulation();

  async function handleSubmit(event: Event) {
    event?.preventDefault();

    const postalCode = stripNonNumericCharacters(postalCodeSignal.value ?? "");

    if (postalCode.length < 8) {
      return;
    }

    try {
      loadingSignal.value = true;

      simulationResultSignal.value = await invoke["deco-components"].actions
        .simulateShipping({
          postalCode,
          items,
          country: cart.value?.storePreferencesData.countryCode || "BRA",
        });
    } catch (err) {
      errorSignal.value = err;
    } finally {
      loadingSignal.value = false;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      class={handleClasses("w-full flex flex-row", classes?.container)}
    >
      {children}
    </form>
  );
}

export default FormSimulation;
