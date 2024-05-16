import { useContext } from 'preact/hooks'
import { ProductContext } from "deco-components/components/product/ProductContext.tsx";

export function useProduct() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error('useProduct must be used within a ProductContext');
  }

  return context;
}