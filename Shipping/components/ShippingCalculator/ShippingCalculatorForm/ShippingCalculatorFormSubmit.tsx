import FormSubmit, {
  FormSubmitProps,
} from "deco-components/components/ui/FormSubmit.tsx";

import useShippingCalculator from "../../../sdk/useShippingCalculator.ts";

export type ShippingCalculatorFormSubmitProps = FormSubmitProps;

function ShippingCalculatorFormSubmit({
  children = "Enviar",
  classes,
  ...props
}: ShippingCalculatorFormSubmitProps) {
  const { loadingSignal } = useShippingCalculator();
  const loading = loadingSignal.value;

  return (
    <FormSubmit
      {...props}
      isLoading={loading}
      class={classes?.button}
      disabled={loading}
    />
  );
}

export default ShippingCalculatorFormSubmit;
