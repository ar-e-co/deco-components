import type { Product } from "apps/commerce/types.ts";
import type { AnatomyClasses } from "deco-components/sdk/styles.ts";
import { handleClasses } from "deco-components/sdk/styles.ts";
import { mapProductToSku } from "deco-components/sdk/useVariantPossibilitiesClientSide.ts";
import { useProduct } from "deco-components/sdk/useProduct.ts";

import { COLOR_FALLBACK_IMG } from "../../../sdk/getSimilarProducts.ts";
import type { ProductWithColorProperties } from "./Types.ts";

const anatomy = [
  "container",
  "optionsContainer",
  "optionAnchor",
  "option",
  "optionHover",
  "optionActive",
  "optionImage",
];

export type ColorSelectorStyles = AnatomyClasses<typeof anatomy[number]>;

export interface Props {
  options?: ProductWithColorProperties[];
  classes?: ColorSelectorStyles;
}

function ColorSelector(
  {
    classes,
    options = [],
  }: Props,
) {
  const { productSignal, skuSelectedSignal } = useProduct();
  const product = productSignal.value;

  if (options.length === 0) {
    return null;
  }

  function onSelectProduct(product: Product) {
    productSignal.value = product;
    const obj = { Title: product?.name!, Url: product?.url };
    history.pushState(obj, obj.Title, obj.Url);
    skuSelectedSignal.value = mapProductToSku(product);
  }

  return (
    <ul class={handleClasses("flex gap-1 items-center", classes?.container)}>
      {options.map((similar) => {
        const { specificColor, thumbnail } = similar;

        const isActive =
          similar.productID === product?.productID;

        return (
          <li>
            <a
              href={similar.url}
              class={handleClasses(
                "flex justify-center items-center cursor-pointer tooltip tooltip-primary transition-colors ease-in-out duration-125",
                classes?.option,
                isActive && classes?.optionActive,
              )}
              data-tip={specificColor}
              onClick={(e) => {
                e.preventDefault();
                onSelectProduct(similar);
              }}
            >
              <img
                class={classes?.optionImage ?? ""}
                src={thumbnail ?? COLOR_FALLBACK_IMG} // Won't happen but just in case
                loading="lazy"
                alt={specificColor}
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default ColorSelector;
