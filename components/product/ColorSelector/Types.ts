import type { Product } from "apps/commerce/types.ts";

export interface ProductWithColorProperties extends Product {
  color: string;
  specificColor: string;
  isAvailable: boolean;
  thumbnail: string;
  position: number;
}
