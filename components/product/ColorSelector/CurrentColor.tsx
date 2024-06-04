import { PDPProduct } from "site/sdk/product/types.ts";
import { useProduct } from "../../../sdk/product/useProduct.ts";

function CurrentColor() {
  const { productSignal } = useProduct<PDPProduct>();
  const product = productSignal.value;

  return <>{product.specificColor}</>;
}

export default CurrentColor;
