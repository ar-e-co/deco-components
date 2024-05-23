import { ComponentChildren } from "preact";
import { SKU } from "apps/vtex/utils/types.ts";
import { useCart } from "apps/vtex/hooks/useCart.ts";

import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts"

import { useShippingSimulation } from "../../../sdk/useShippingSimulation.ts"

const anatomy = ["container"] as const;

type Styles = AnatomyClasses<typeof anatomy[number]>;

export interface Props {
  classes?: Styles;
  items: Array<SKU>;
  children: ComponentChildren
};

function FormSimulation({ 
  items, 
  classes, 
  children,
}: Props) {
  const { simulate, cart } = useCart();

  const {
    postalCodeSignal,
    simulationResultSignal,
    loadingSignal,
    errorSignal,
  } = useShippingSimulation();

  async function handleSubmit(event: Event) {
    event?.preventDefault();

    if (postalCodeSignal.value?.length !== 8) {
      return;
    }

    try {
      loadingSignal.value = true;

      simulationResultSignal.value = await simulate({
        items: items,
        postalCode: postalCodeSignal.value,
        country: cart.value?.storePreferencesData.countryCode || "BRA",
      });

    } catch (err) {
      errorSignal.value = err;
    }
    finally {
      loadingSignal.value = false;
    }
  }

  console.log(simulationResultSignal.value)

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