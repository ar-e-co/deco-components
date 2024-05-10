import type { Product ,PropertyValue } from "apps/commerce/types.ts";

export const getAdditionalProperty = (productTag :String , additionalProperty: Product["additionalProperty"]) => {
  const tags = additionalProperty?.filter((p: PropertyValue ) => productTag?.includes(p?.value as string) );
  return tags;
};  