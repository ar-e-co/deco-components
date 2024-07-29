import FormSubmit, {
  FormSubmitProps,
} from "deco-components/components/ui/FormSubmit.tsx";

import useShippingSimulation from "../../sdk/useShippingSimulation.ts";

export type ShippingSimulationFormSubmitProps = FormSubmitProps;

function ShippingSimulationFormSubmit({
  children = "Enviar",
  ...props
}: ShippingSimulationFormSubmitProps) {
  const { loadingSignal } = useShippingSimulation();
  const loading = loadingSignal.value;

  return (
    <FormSubmit
      {...props}
      isLoading={loading}
      disabled={loading}
    >
      {children}
    </FormSubmit>
  );
}

export default ShippingSimulationFormSubmit;
