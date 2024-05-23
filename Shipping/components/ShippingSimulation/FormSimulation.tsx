import { useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import { SKU } from "apps/vtex/utils/types.ts";
import { useCart } from "apps/vtex/hooks/useCart.ts";

import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts"

import { useShippingCalculator } from "../../sdk/useShippingCalculator.ts"

  const anatomy = [
    "container",
    "input",
    "button"
  ] as const;
  
  type Styles = AnatomyClasses<typeof anatomy[number]>;
  
  export interface Props {
    classes?: Styles;
    items: Array<SKU>;
    textButton?: string
  };

function FormSimulation({ items,classes, textButton }: Props) {
    const { postalCode , simulateResult } = useShippingCalculator();

    const loading = useSignal(false);
    const { simulate, cart } = useCart();
    const handleSimulation = useCallback(async () => {
      if (postalCode.value?.length !== 8) {
        return;
      }
      try {
        loading.value = true;
        simulateResult.value = await simulate({
          items: items,
          postalCode: postalCode.value,
          country: cart.value?.storePreferencesData.countryCode || "BRA",
        });
      } finally {
        loading.value = false;
      }
    }, [items, postalCode.value]);

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSimulation();
          }}
          class={handleClasses( classes?.container) || "w-full flex flex-row"}
        >
          <input
            as="input"
            type="text"
            class={handleClasses( classes?.input) || " bg-gray-100 rounded-full px-4  join-item w-full border border-transparent outline-none"}
            placeholder="Seu cep aqui"
            value={postalCode.value ?? ""}
            maxLength={8}
            size={8}
            onChange={(e: { currentTarget: { value: string } }) => {
              postalCode.value = e.currentTarget.value;
            }}
          />
          <button
            type="submit"
            class={handleClasses( classes?.button) || "btn no-animation btn-primary join-item ml-2 "}
          >
            {textButton ||"Calcular"}
          </button>
        </form>
    );
  }
  
  export default FormSimulation;