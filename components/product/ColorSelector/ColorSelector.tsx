import type { Product } from "apps/commerce/types.ts";
import type { AnatomyClasses } from "deco-components/sdk/styles.ts";
import { handleClasses } from "deco-components/sdk/styles.ts";
import { useProduct } from "../../../sdk/product/useProduct.ts";

import { COLOR_FALLBACK_IMG } from "../../../sdk/product/getSimilarProducts.ts";
import type { ProductWithColorProperties } from "./Types.ts";
import { relative } from "deco-components/sdk/url.ts";

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
  onProductSelect?: (product: Product) => void;
  changeURLOnSelect?: boolean;
}

function ColorSelector(
  {
    classes,
    options = [],
    onProductSelect,
    changeURLOnSelect,
  }: Props,
) {
  const { productSignal } = useProduct();
  const product = productSignal.value;

  if (options.length === 0) {
    return null;
  }

  function handleSelect(newProduct: Product) {
    productSignal.value = newProduct;
    onProductSelect?.(newProduct);
    if (changeURLOnSelect) {
      const obj = {
        Title: newProduct?.name!,
        Url: newProduct.isVariantOf?.url,
      };
      history.pushState(obj, obj.Title, obj.Url);
    }
  }

  return (
    <ul class={handleClasses("flex gap-1 items-center", classes?.container)}>
      {options.map((similar) => {
        const { specificColor, thumbnail } = similar;

        const isActive = similar.productID === product?.productID;

        return (
          <li>
            <a
              href={relative(similar.isVariantOf?.url)}
              class={handleClasses(
                "flex justify-center items-center cursor-pointer tooltip tooltip-primary transition-colors ease-in-out duration-125",
                classes?.option,
                isActive && classes?.optionActive,
              )}
              data-tip={specificColor}
              onClick={(e) => {
                e.preventDefault();
                handleSelect(similar);
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
