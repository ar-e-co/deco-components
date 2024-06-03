import type { BreadcrumbList } from "apps/commerce/types.ts";
import { ComponentChildren } from "preact";
import { AnatomyClasses, handleClasses } from "../../sdk/styles.ts";

const anatomy = [
  "container",
  "separator",
  "link",
  "item",
] as const;

type BreadcrumbStyle = AnatomyClasses<typeof anatomy[number]>;

interface BreadcrumbProps {
  separator?: ComponentChildren;
  classes?: BreadcrumbStyle;
  items: BreadcrumbList["itemListElement"];
}

function Breadcrumb({
  classes,
  separator = "/",
  items = [],
}: BreadcrumbProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <ul class={handleClasses("flex items-center gap-1", classes?.container)}>
      {items
        .filter(({ name, item }) =>
          name && item
        )
        .map(({ name, item }, i) => (
          <>
            {i > 0 && (
              <p
                class={handleClasses(
                  "text-inherit leading-inherit",
                  classes?.separator,
                )}
              >
                {separator}
              </p>
            )}

            <li
              class={handleClasses(
                "text-inherit leading-inherit",
                classes?.item,
              )}
            >
              <a
                class={handleClasses(
                  "text-inherit leading-inherit",
                  classes?.link,
                )}
                href={item}
              >
                {name}
              </a>
            </li>
          </>
        ))}
    </ul>
  );
}

export default Breadcrumb;
