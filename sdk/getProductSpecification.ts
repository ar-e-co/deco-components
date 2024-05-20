import type { Product, PropertyValue } from "apps/commerce/types.ts";

export const getProductSpecification = (specification: string, isVariantOf: Product["isVariantOf"]) => {
  const specificationItem = isVariantOf
    ?.additionalProperty
    .filter((p: PropertyValue ) => specification?.includes(p?.name as string) );

  return specificationItem;
};