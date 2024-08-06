import type {
  BreadcrumbList,
  Product,
  PropertyValue,
} from "apps/commerce/types.ts";

export function getAdditionalProperty(
  propertyName: string,
  additionalProperty: Product["additionalProperty"],
) {
  const prop = additionalProperty
    ?.find((p: PropertyValue) =>
      propertyName?.toLowerCase() === p.name?.toLowerCase()
    );

  return prop;
}

export function getProductSpecification(
  specification: string,
  isVariantOf: Product["isVariantOf"],
) {
  const specificationItem = isVariantOf
    ?.additionalProperty
    .find((p: PropertyValue) =>
      specification?.toLowerCase() === p.name?.toLowerCase()
    );

  return specificationItem;
}

/** @description Remove last breadcrumb item (product name) */
export function formatBreadcrumbs(
  breadcrumbList: BreadcrumbList,
): BreadcrumbList | null {
  if (!breadcrumbList) {
    return null;
  }

  return {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };
}
