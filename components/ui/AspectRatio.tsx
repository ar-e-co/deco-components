import type { ComponentChildren, JSX } from "preact";
import { clx } from "deco-components/sdk/clx.ts";

// Most common
export type AvailableAspectRatios =
  | "1:1"
  | "2:3"
  | "3:2"
  | "3:4"
  | "4:3"
  | "4:5"
  | "5:4"
  | "9:16"
  | "16:9";

type ChildrenProps = {
  width?: number;
  height?: number;
  defaultClasses?: string;
};

export type Props = JSX.IntrinsicElements["div"] & {
  children: ComponentChildren | ((props: ChildrenProps) => JSX.Element);
  aspectRatio: AvailableAspectRatios;
  aspectRatioPaddingTop?: string;
  width: number;
};

function AspectRatio({
  children,
  aspectRatio,
  aspectRatioPaddingTop,
  width,
  class: _class,
  className,
}: Props) {
  let paddingTop = aspectRatioPaddingTop;
  let height;

  if (aspectRatio) {
    const [widthRatio, heightRatio] = aspectRatio.split(":").map(Number);
    const ratio = heightRatio / widthRatio;
    height = Number((ratio * width).toPrecision(2));

    if (!paddingTop) {
      paddingTop = `${(ratio * 100).toPrecision(2)}%`;
    }
  }

  return (
    <div
      class={clx(
        "relative w-full h-0 [&>*]:absolute [&>*]:top-0 [&>*]:left-0 [&>*]:w-full [&>*]:h-full",
        _class as string,
        className as string,
      )}
      style={{ paddingTop }}
    >
      {typeof children === "function"
        ? children({ width, height, defaultClasses: "object-cover" })
        : children}
    </div>
  );
}

export default AspectRatio;
