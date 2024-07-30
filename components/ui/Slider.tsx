import type { ComponentChildren, JSX } from "preact";
import { handleClasses } from "deco-components/sdk/styles.ts";
import Icon, { Props as IconProps } from "deco-components/components/ui/Icon.tsx";

function Dot({ index, children }: {
  index: number;
  children: ComponentChildren;
}) {
  return (
    <button
      data-dot={index}
      aria-label={`go to slider item ${index}`}
      class="focus:outline-none group"
    >
      {children}
    </button>
  );
}

function Slider(props: JSX.IntrinsicElements["ul"]) {
  return <ul data-slider {...props} />;
}

function Item({
  index,
  ...props
}: JSX.IntrinsicElements["li"] & { index: number }) {
  return <li data-slider-item={index} {...props} />;
}

type SlideButtonProps = JSX.IntrinsicElements["button"] & {
  iconProps?: IconProps;
};

function NextButton(
  { class: _class, children, iconProps, ...props }: SlideButtonProps,
) {
  return (
    <button
      data-slide="next"
      aria-label="Next item"
      class={handleClasses(
        "text-black btn btn-circle btn-outline border-none hover:border-none w-6 h-6 min-h-6 hover:bg-transparent bg-transparent flex justify-center items-center hover:text-black disabled:hidden",
        _class as string,
      )}
      {...props}
    >
      {children}
      {!children && (
        <Icon size={16} id="ArrowRightLight" strokeWidth={0.5} {...iconProps} />
      )}
    </button>
  );
}

function PrevButton(
  { class: _class, children, iconProps, ...props }: SlideButtonProps,
) {
  return (
    <button
      data-slide="prev"
      aria-label="Previous item"
      class={handleClasses(
        "btn btn-circle btn-outline border-none hover:border-none w-6 h-6 min-h-6 hover:bg-transparent bg-transparent flex justify-center items-center hover:text-black disabled:hidden",
        _class as string,
      )}
      {...props}
    >
      {children}
      {!children && (
        <Icon size={16} id="ArrowLeft" strokeWidth={0.5} {...iconProps} />
      )}
    </button>
  );
}

Slider.Dot = Dot;
Slider.Item = Item;
Slider.NextButton = NextButton;
Slider.PrevButton = PrevButton;

export default Slider;
