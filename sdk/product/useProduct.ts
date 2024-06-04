import { useContext } from "preact/hooks";
import {
  ProductContext,
  ProductContextState,
} from "deco-components/components/product/ProductContext.tsx";
import { Product } from "apps/commerce/types.ts";

export function useProduct<T extends Product>() {
  const context = useContext<ProductContextState<T>>(ProductContext);

  if (!context) {
    throw new Error("useProduct must be used within a ProductContext");
  }

  return context;
}
