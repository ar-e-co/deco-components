import type { Product } from "apps/commerce/types.ts";
import type { AnatomyClasses } from "deco-components/sdk/styles.ts";
import { handleClasses } from "deco-components/sdk/styles.ts";
import { useProduct } from "../../../sdk/product/useProduct.ts";

import { COLOR_FALLBACK_IMG } from "../../../sdk/product/getSimilarProducts.ts";
import type { ProductWithColorProperties } from "./Types.ts";
import { relative } from "deco-components/sdk/url.ts";
import Slider, {
  SlideButtonProps,
} from "deco-components/components/ui/Slider.tsx";
import SliderJS, {
  Props as SliderProps,
} from "deco-components/components/ui/SliderJS.tsx";
import { useId } from "deco-components/sdk/useId.ts";
import { clx } from "deco-components/sdk/clx.ts";

const anatomy = [
  "container",

  "optionAnchor",
  "optionActive",
  "optionImage",

  "slider",
  "slider--item",
  "sliderButton",
  "sliderButton--prev",
  "sliderButton--next",
];

export type ColorSelectorStyles = AnatomyClasses<typeof anatomy[number]>;

export interface Props {
  options?: ProductWithColorProperties[];
  classes?: ColorSelectorStyles;
  onProductSelect?: (product: Product) => void;
  changeURLOnSelect?: boolean;
  mode?: "slider" | "default";
  sliderProps?: Partial<SliderProps>;
  sliderButtonProps?: Partial<SlideButtonProps>;
  nextButtonProps?: Partial<SlideButtonProps>;
  prevButtonProps?: Partial<SlideButtonProps>;
}

function ColorSelector(
  {
    classes,
    options = [],
    onProductSelect,
    changeURLOnSelect,
    mode = "default",
    sliderProps,
    sliderButtonProps,
    prevButtonProps,
    nextButtonProps,
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
    onProductSelect?.(newProduct);

    if (changeURLOnSelect) {
      const obj = {
        Title: newProduct?.name!,
        Url: newProduct.isVariantOf?.url,
      };

      history.pushState(obj, obj.Title, obj.Url);
    }
  }

  function renderOptionLink(option: ProductWithColorProperties) {
    const isActive = option.productID === product?.productID;
    const { specificColor, thumbnail } = option;

    return (
      <a
        href={relative(option.isVariantOf?.url)}
        class={handleClasses(
          "flex justify-center items-center cursor-pointer tooltip tooltip-primary transition-colors ease-in-out duration-125",
          classes?.optionAnchor,
          isActive && classes?.optionActive,
        )}
        data-tip={specificColor}
        onClick={(e) => {
          e.preventDefault();
          handleSelect(option);
        }}
      >
        <img
          class={classes?.optionImage ?? ""}
          src={thumbnail ?? COLOR_FALLBACK_IMG} // Won't happen but just in case
          loading="lazy"
          alt={specificColor}
        />
      </a>
    );
  }

  function renderOptions() {
    return options.map((similar, index) => {
      if (mode === "default") {
        return (
          <li>
            {renderOptionLink(similar)}
          </li>
        );
      }

      return (
        <Slider.Item
          index={index}
          class={handleClasses("carousel-item", classes?.["slider--item"])}
        >
          {renderOptionLink(similar)}
        </Slider.Item>
      );
    });
  }

  if (mode === "default") {
    return (
      <ul
        class={handleClasses(
          "flex flex-wrap gap-1 items-center",
          classes?.container,
        )}
      >
        {renderOptions()}
      </ul>
    );
  }

  return (
    <div
      id={rootId}
      class={handleClasses(
        "flex items-center gap-2 w-full relative overflow-x-scroll no-scrollbar leading-null",
        classes?.container,
      )}
    >
      <div
        class={clx(
          "relative left-4 mr-2 z-10",
          classes?.["sliderButton"],
          classes?.["sliderButton--prev"],
        )}
      >
        <Slider.PrevButton {...sliderButtonProps} {...prevButtonProps} />
      </div>

      <Slider
        class={handleClasses(
          "carousel max-w-36 flex-1 gap-1 items-center relative",
          classes?.slider,
        )}
      >
        {renderOptions()}
      </Slider>

      <div
        class={clx(
          "relative right-4 ml-2 z-10",
          classes?.["sliderButton"],
          classes?.["sliderButton--next"],
        )}
      >
        <Slider.NextButton {...sliderButtonProps} {...nextButtonProps} />
      </div>

      <SliderJS
        {...sliderProps}
        rootId={rootId}
      />
    </div>
  );
}

export default ColorSelector;
