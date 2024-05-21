import { useCart } from "apps/vtex/hooks/useCart.ts";
import { useSignal,SKU } from "@preact/signals";
import { useCallback } from "preact/hooks";
import { useShippingCalculator } from "../../sdk/useShippingCalculator.ts";


export interface Props {
    items: Array<SKU>;
  }

  
function FormSimulation({ items }: Props) {
    const { postalCode , simulateResult } = useShippingCalculator();
    const loading = useSignal(false);
    const { simulate, cart } = useCart();
    const handleSimulation = useCallback(async () => {
      if (postalCode.value.length !== 8) {
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

  
    console.log(simulateResult)
    return (
     
  
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSimulation();
          }}
          class="w-full flex flex-row"
        >
          <input
            as="input"
            type="text"
            class=" bg-gray-100 rounded-full px-4  join-item w-full border border-transparent outline-none"
            placeholder="Seu cep aqui"
            value={postalCode.value}
            maxLength={8}
            size={8}
            onChange={(e: { currentTarget: { value: string } }) => {
              postalCode.value = e.currentTarget.value;
            }}
          />
          <button
            type="submit"
            class="btn no-animation btn-primary join-item ml-2 "
          >
            Calcular
          </button>
        </form>
  
    );
  }
  
  export default FormSimulation;