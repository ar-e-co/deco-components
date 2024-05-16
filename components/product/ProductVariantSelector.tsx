import type { Product } from "apps/commerce/types.ts";
import { useProduct } from "deco-components/sdk/useProduct.ts";

import { SpecificationsDictionary } from "../../loaders/ArCo/getListOfSpecifications.tsx";
import { relative } from "../../sdk/url.ts";
import {
  useVariantPossibilities,
} from "../../sdk/useVariantPossibilities.ts";
import Avatar, { Props as AvatarProps } from "../ui/Avatar.tsx";
import { AnatomyClasses, handleClasses } from "../../sdk/styles.ts";
import { omit } from "../../sdk/utils.ts";

const anatomy = [
  "variationsList",
  "variationListItem",
  "variationTitle",
  "variationOptionsList",
  "variationOptionListItem",
  "variationOptionLink",
  "variationOptionAvatar",
] as const;

export type VariantSelectorStyles = AnatomyClasses<typeof anatomy[number]>;

export interface Props {
  product: Product;
  listOfSizes?: SpecificationsDictionary;
  classes?: VariantSelectorStyles;
  avatarProps?: Partial<AvatarProps>
}

function VariantSelector({ 
  classes,
  avatarProps,
}: Props) {
  const { productSignal, skuSelectedSignal } = useProduct();

  const product = productSignal.value;
  const sku = skuSelectedSignal.value;

  const { url, isVariantOf } = product;

  const hasVariant = isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(hasVariant, product);

  // function handleVariationSelect(e: Event, sku: Product) {
  //   e.preventDefault();
  //   skuSelectedSignal.value = sku;
  //   const obj = { Title: sku.name ?? "", Url: sku.url };
  //   history.pushState(obj, obj.Title, obj.Url);
  // }

  // console.log({
  //   possibilities,
  //   hasVariant
  // })

  return (
    <ul class={handleClasses("flex flex-col gap-4", classes?.variationsList)}>
      {Object.keys(possibilities).map((name) => (
        <li class={handleClasses("flex flex-col gap-2", classes?.variationListItem)}>
          <span class={classes?.variationTitle}>
            {name}
          </span>

          <ul class={handleClasses("flex flex-row", classes?.variationOptionsList)}>
            {Object.entries(possibilities[name]).map(([value, skuVal]) => {
              const relativeUrl = relative(sku?.url ?? url);
              const relativeLink = relative(sku?.url ?? url);

              return (
                <li class={classes?.variationOptionListItem}>
                  <a
                    class={classes?.variationOptionLink}
                    href={relativeLink}
                  >
                    <Avatar
                      content={value}
                      variant={relativeLink === relativeUrl
                        ? "active"
                        : relativeLink &&
                          sku?.availability === "https://schema.org/InStock"
                          ? "default"
                          : "disabled"}
                      classes={{
                        container: "text-sm font-light max-h-6 min-w-9",
                        text: "uppercase",
                        ...avatarProps?.classes,
                      }}
                      {...omit(['classes'], avatarProps)}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
  </ul>
);
}

export default VariantSelector;
