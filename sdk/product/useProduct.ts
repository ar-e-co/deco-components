import { useContext } from "preact/hooks";
import {
  ProductContext,
  ProductContextState,
} from "deco-components/components/product/ProductContext.tsx";
import { Product, ProductLeaf } from "apps/commerce/types.ts";

export function useProduct<T extends Product = Product, S extends ProductLeaf = ProductLeaf>() {
  const context = useContext<ProductContextState<T, S>>(ProductContext);

  if (!context) {
    throw new Error("useProduct must be used within a ProductContext");
  }

  return context;
}
