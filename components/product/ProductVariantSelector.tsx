import { JSX } from "preact/jsx-runtime";
import { useProduct } from "deco-components/sdk/useProduct.ts";
import { relative } from "deco-components/sdk/url.ts";
import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";
import type { VariantPossibility } from "deco-components/sdk/useVariantPossibilities.ts";

const anatomy = [
  "container",
  "item",
  "link",
] as const;

export type VariantSelectorStyles = AnatomyClasses<typeof anatomy[number]>;

export type { VariantPossibility };

export type ChildrenProps =
  & { skuID: string; isActive: boolean }
  & VariantPossibility;

export interface Props {
  classes?: VariantSelectorStyles;
  variants: [string, VariantPossibility][];
  children: (props: ChildrenProps) => JSX.Element;
}

function VariantSelector({
  classes,
  variants,
  children,
}: Props) {
  const { productSignal, skuSelectedIDSignal } = useProduct();
  const product = productSignal.value;
  const skuSelectedID = skuSelectedIDSignal.value;

  function handleVariationSelect({
    e,
    link,
    skuID,
    isAvailable,
  }: {
    e: Event;
    link: string;
    isAvailable: boolean;
    skuID: string;
  }) {
    e.preventDefault();

    if (!isAvailable) {
      return;
    }

    skuSelectedIDSignal.value = skuID;

    if (link) {
      const obj = { Title: product.name ?? "", Url: link };
      history.replaceState(obj, obj.Title, obj.Url);
    }
  }

  return (
    <ul class={handleClasses("flex flex-row", classes?.container)}>
      {variants.map(([skuID, { url: link, value, isAvailable }]) => {
        const relativeLink = relative(link);
        const isActive = skuID === skuSelectedID;

        return (
          <li class={classes?.item}>
            <a
              class={classes?.link}
              href={relativeLink}
              onClick={(e) =>
                handleVariationSelect({
                  e,
                  link: link ?? "",
                  skuID,
                  isAvailable,
                })}
            >
              {children({ isActive, skuID, value, isAvailable, url: link })}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default VariantSelector;
