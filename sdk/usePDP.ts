import { Product } from "apps/commerce/types.ts";
import { signal } from "@preact/signals";
import { Sku } from "./useVariantPossibilitiesClientSide.ts";

const productSelected = signal<Product | null>(null);

const skuSelected = signal<Sku | null>(null);

const state = {
  productSelected,
  skuSelected,
};

export const usePDP = () => state;
