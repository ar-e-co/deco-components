import { useProduct } from "deco-components/sdk/useProduct.ts";
import { Product } from "apps/commerce/types.ts";

export interface Props {
  specificColorPropertyLabel: string;
}

function CurrentColor({ specificColorPropertyLabel }: Props) {
  const { productSignal } = useProduct();
  const product: Product = productSignal.value;

  const color = product?.isVariantOf
    ?.additionalProperty
    ?.find(prop => prop.name === specificColorPropertyLabel)?.value

  return (<>{color}</>)
}

export default CurrentColor