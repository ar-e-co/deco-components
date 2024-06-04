// ISLAND
import { Signal, useComputed, useSignal } from "@preact/signals";
import { ComponentChildren, createContext } from "preact";
import { Product, ProductLeaf } from "apps/commerce/types.ts";

export type ProductContextState<T extends Product> = {
  productSignal: Signal<T>;
  skuSelectedIDSignal: Signal<string | null>;
  skuSelectedSignal: Signal<ProductLeaf | null>;
};

// deno-lint-ignore no-explicit-any
export const ProductContext = createContext<ProductContextState<any>>(
  {} as never,
);

export type ProductContextProps<T extends Product> = {
  product: T;
  skuSelectedID?: string | number | null | undefined;
  children: ComponentChildren;
};

function ProductProvider<T extends Product>({
  skuSelectedID: skuSelectedIDProp,
  product: productProp,
  children,
}: ProductContextProps<T>) {
  const productSignal = useSignal(productProp);

  const skuSelectedIDSignal = useSignal(
    skuSelectedIDProp ? String(skuSelectedIDProp) : null,
  );

  const skuSelectedSignal = useComputed(() => {
    const skuSelectedID = skuSelectedIDSignal.value;
    const product = productSignal.value;
    return product?.isVariantOf?.hasVariant?.find((variant) =>
      variant.sku === skuSelectedID
    ) ?? null;
  });

  return (
    <ProductContext.Provider
      value={{
        productSignal,
        skuSelectedIDSignal,
        skuSelectedSignal,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export default ProductProvider;
