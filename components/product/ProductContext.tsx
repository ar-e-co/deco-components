// ISLAND
import { Signal, useComputed, useSignal } from "@preact/signals";
import { ComponentChildren, createContext } from "preact";
import { BreadcrumbList, Product, ProductLeaf } from "apps/commerce/types.ts";

export type ProductContextState = {
  productSignal: Signal<Product>;
  skuSelectedIDSignal: Signal<string | null>;
  skuSelectedSignal: Signal<ProductLeaf | null>;
  breadcrumbList?: BreadcrumbList | null;
};

export const ProductContext = createContext<ProductContextState>({} as never);

export type ProductContextProps = {
  product: Product;
  skuSelectedID?: string | number | null | undefined;
  children: ComponentChildren;
  breadcrumbList?: BreadcrumbList | null;
};

function ProductProvider({
  skuSelectedID: skuSelectedIDProp,
  product: productProp,
  children,
  breadcrumbList,
}: ProductContextProps) {
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
        breadcrumbList,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export default ProductProvider;
