import type { Product } from "apps/commerce/types.ts";
import type { AnatomyClasses } from "deco-components/sdk/styles.ts";
import { handleClasses } from "deco-components/sdk/styles.ts";
import { useProduct } from "../../../sdk/product/useProduct.ts";

import { COLOR_FALLBACK_IMG } from "../../../sdk/product/getSimilarProducts.ts";
import type { ProductWithColorProperties } from "./Types.ts";
import { relative } from "deco-components/sdk/url.ts";
import Slider from "deco-components/components/ui/Slider.tsx";
import SliderJS from "deco-components/islands/SliderJS.tsx";
import { useId } from "deco-components/sdk/useId.ts";

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
  const rootId = useId();

  if (options.length === 0) {
    return null;
  }

  function handleSelect(newProduct: Product) {
    productSignal.value = newProduct;
    console.log("signalTeste", productSignal.value.name);
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
    <div
      id={rootId}
      class={handleClasses(
        "w-full flex gap-2 relative overflow-x-scroll no-scrollbar leading-null",
        classes?.container,
      )}
    >
      <div class="hidden relative top-1/2 -translate-y-1/2 left-4 mr-2 md:block z-10">
        <Slider.PrevButton />
      </div>

      <Slider
        class={handleClasses(
          "carousel max-w-36 flex-1 gap-1 items-center relative",
          classes?.optionsContainer,
        )}
      >
        {options.map((similar, index) => {
          const { specificColor, thumbnail } = similar;

          const isActive = similar.productID === product?.productID;

          return (
            <Slider.Item index={index}>
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
            </Slider.Item>
          );
        })}
      </Slider>

      <div class="hidden relative top-1/2 -translate-y-1/2 right-4 ml-2 md:block z-10">
        <Slider.NextButton />
      </div>

      <SliderJS rootId={rootId} />
    </div>
  );
}

export default ColorSelector;
