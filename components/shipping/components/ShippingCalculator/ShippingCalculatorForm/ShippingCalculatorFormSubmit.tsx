import FormSubmit, {
  FormSubmitProps,
} from "deco-components/components/ui/FormSubmit.tsx";

import useShippingCalculator from "../../../sdk/useShippingCalculator.ts";

export type ShippingCalculatorFormSubmitProps = FormSubmitProps;

function ShippingCalculatorFormSubmit({
  children = "Enviar",
  ...props
}: ShippingCalculatorFormSubmitProps) {
  const { loadingSignal } = useShippingCalculator();
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

export default ShippingCalculatorFormSubmit;
