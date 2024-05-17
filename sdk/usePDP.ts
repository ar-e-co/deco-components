import { Product } from "apps/commerce/types.ts";
import { signal } from "@preact/signals";

const productSelected = signal<Product | null>(null);

const skuSelected = signal<any>(null);

const state = {
  productSelected,
  skuSelected,
};

export const usePDP = () => state;
