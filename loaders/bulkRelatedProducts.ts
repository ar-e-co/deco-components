import { AppContext } from "deco-components/mod.ts";
import { Product } from "apps/commerce/types.ts";

import { Props as RelatedProductsLoaderProps } from "apps/vtex/loaders/legacy/relatedProductsLoader.ts";

export interface Props extends Omit<RelatedProductsLoaderProps, "id"> {
  productIds: string[];
}

export default async function loader(
  { productIds, crossSelling = "similars", ...props }: Props,
  _req: Request,
  ctx: AppContext,
): Promise<Record<string, Product[]>> {
  const relatedProducts = await Promise.allSettled(
    (productIds ?? []).map((productId) => (
      ctx.invoke.vtex.loaders.legacy.relatedProductsLoader({
        id: productId,
        crossSelling,
        ...props,
      })
    )),
  ).then((results) =>
    results.map((r) => r.status === "fulfilled" ? r.value ?? [] : [])
  );

  // productIds order is not guaranteed between the request and the response,
  // hence these manipulations to ensure the correct order
  const re = productIds.reduce((acc, id, idx) => {
    acc[id] = relatedProducts[idx];
    return acc;
  }, {} as Record<string, Product[]>);

  return re;
}

export function cacheKey({ productIds }: Props, _req: Request) {
  return productIds.sort().join("-");
}
