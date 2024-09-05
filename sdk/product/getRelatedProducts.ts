import { Props } from "apps/vtex/loaders/legacy/relatedProductsLoader.ts";
import { invoke } from "deco-components/runtime.ts";

export async function getRelatedProducts(
  productID: string,
  options?: Omit<Partial<Props>, "id">,
) {
  const related = await invoke["vtex"].loaders.legacy.relatedProductsLoader({
    crossSelling: "similars",
    id: productID,
    ...options,
  });

  return related;
}
