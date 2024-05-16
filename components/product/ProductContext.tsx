// ISLAND
import { useSignal, Signal } from "@preact/signals";
import { createContext, ComponentChildren } from 'preact'
import { Product } from "apps/commerce/types.ts";
import { Sku } from "../../sdk/useVariantPossibilitiesClientSide.ts";

export type ProductContextState = {
  productSignal: Signal<Product>;
  skuSelectedSignal: Signal<Sku | null>;
}

export const ProductContext = createContext<ProductContextState>({} as never)

export type ProductContextProps = {
  product: Product;
  skuSelected?: unknown | null | undefined;
  children: ComponentChildren
}

function ProductProvider({ product: productProp, children }: ProductContextProps) {
  const productSignal = useSignal(productProp);
  const skuSelectedSignal = useSignal(null);

  return (
    <ProductContext.Provider value={{
      productSignal,
      skuSelectedSignal,
    }}>
      {children}
    </ProductContext.Provider>
  )
}

export default ProductProvider