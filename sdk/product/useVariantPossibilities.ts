import type { Offer, ProductLeaf, PropertyValue } from "apps/commerce/types.ts";

export type VariantPossibility = {
  value: string;
  isAvailable: boolean;
  url: string;
  offer: Offer | null;
  original: ProductLeaf;
};

export type Possibilities = {
  [variantName: string]: {
    [productID: string]: VariantPossibility;
  };
};

const hash = ({ name, value }: PropertyValue) => `${name}::${value}`;

const omit = new Set(["category", "cluster", "RefId", "descriptionHtml"]);

export const useVariantPossibilities = (
  variants: ProductLeaf[],
  selected: ProductLeaf,
): Possibilities => {
  const possibilities: Possibilities = {};
  const selectedSpecs = new Set(selected.additionalProperty?.map(hash));

  for (const variant of variants) {
    const { url, additionalProperty = [], productID } = variant;
    const isSelected = productID === selected.productID;
    const specs = additionalProperty.filter(({ name }) => !omit.has(name!));
    const offer = variant.offers
      ?.offers
      ?.find(({ availability }) =>
        availability === "https://schema.org/InStock"
      ) ?? null;

    for (let it = 0; it < specs.length; it++) {
      const name = specs[it].name!;
      const value = specs[it].value!;

      if (omit.has(name)) continue;

      if (!possibilities[name]) {
        possibilities[name] = {};
      }

      // First row is always selectable
      const isSelectable = it === 0 ||
        specs.every((s) => s.name === name || selectedSpecs.has(hash(s)));

      possibilities[name][productID] = {
        value,
        offer,
        isAvailable: !!offer,
        original: variant,
        url: (isSelected
          ? url
          : isSelectable
          ? possibilities[name][productID]?.url || url
          : possibilities[name][productID]?.url) ?? "",
      };
    }
  }

  return possibilities;
};
