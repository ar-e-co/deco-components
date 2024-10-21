import type { Product } from "apps/commerce/types.ts";
import type { Specification } from "deco-components/loaders/storeConfig.ts";
import type { ProductWithColorProperties } from "../../components/product/ColorSelector/Types.ts";

export const COLOR_FALLBACK_IMG = "/image/thumbnail-error.png";

export interface FormatSimilarProductsOptions {
  // this will only work calculating availability looking at all variants, and not the offers
  bringCurrentColorToFront?: boolean;
  /** @default true */
  orderBySpecification?: boolean;
}

function formatSimilarProducts({
  product,
  similars,
  colorsSpecification,
  colorThumbnailKey,
  specificColorFieldName,
  bringCurrentColorToFront,
  orderBySpecification = true,
}: {
  product: Product;
  similars?: Product[] | null;
  colorsSpecification: Specification | undefined;
  colorThumbnailKey: string;
  specificColorFieldName: string;
  bringCurrentColorToFront?: boolean;
  orderBySpecification?: boolean;
}) {
  if (!product || !colorsSpecification || !specificColorFieldName) {
    return {
      product: product as ProductWithColorProperties,
      similarProducts: [],
    };
  }

  // Extract required properties to object root
  const allSimilarProducts: ProductWithColorProperties[] = [
    product,
    ...similars ?? product.isSimilarTo ?? [],
  ]
    .map((similar) => {
      const properties = similar.isVariantOf?.additionalProperty ?? [];
      let color = "";
      let specificColor = "";

      // Imperative, but just one iteration
      properties.forEach((prop) => {
        if (prop.name === colorsSpecification.fieldName) {
          color = prop.value ?? "";
        } else if (prop.name === specificColorFieldName) {
          specificColor = prop.value ?? "";
        }
      });

      const thumbnail = similar.image?.find((img) =>
        img.name === colorThumbnailKey
      )?.url ?? COLOR_FALLBACK_IMG;

      const position = colorsSpecification.values?.[color]?.Position ??
        999;

      return {
        ...similar,
        color,
        specificColor,
        thumbnail,
        position,
      };
    });

  let similarProducts = allSimilarProducts;
  const extendedProduct = allSimilarProducts[0];

  if (orderBySpecification) {
    similarProducts = similarProducts.sort(
      (
        { inProductGroupWithID: currentId, position: currentPosition },
        { inProductGroupWithID: nextId, position: nextPosition },
      ) => {
        // Order by position first, then by productID
        if (currentPosition > nextPosition) return 1;
        if (currentPosition < nextPosition) return -1;

        return Number(currentId) - Number(nextId);
      },
    );
  }

  if (bringCurrentColorToFront) {
    similarProducts = [
      extendedProduct,
      ...similarProducts.filter(({ productID }) =>
        productID !== product.productID
      ),
    ];
  }

  return {
    product: extendedProduct,
    similarProducts,
  };
}

export default formatSimilarProducts;
