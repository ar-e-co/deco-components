import { ProductDetailsPage } from "apps/commerce/types.ts";
import { ExtensionOf } from "apps/website/loaders/extension.ts";

import { AppContext } from "deco-components/mod.ts";
import {
  createClient,
  getProductId,
  PaginationOptions,
} from "apps/verified-reviews/utils/client.ts";
import { Reviews } from "apps/verified-reviews/utils/types.ts";
import {
  toRating,
  toReview,
} from "deco-components/sdk/verified-reviews/transform.ts";
import {
  ExtendedAggregateRating,
  ExtendedReview,
} from "deco-components/sdk/verified-reviews/types.ts";

export type Props = PaginationOptions & {
  aggregateSimilarProducts?: boolean;
};

/**
 * @title Opiniões verificadas - Full Review for Product (Ratings and Reviews)
 */
export default function verifiedReviewsPDP(
  config: Props,
  _req: Request,
  ctx: AppContext,
): ExtensionOf<ProductDetailsPage | null> {
  const client = createClient({ ...ctx.configVerifiedReviews });

  return async (productDetailsPage: ProductDetailsPage | null) => {
    if (!productDetailsPage) {
      return null;
    }

    if (!client) {
      return null;
    }

    const productId = getProductId(productDetailsPage.product);
    let productsToGetReviews = [productId];

    if (config.aggregateSimilarProducts) {
      productsToGetReviews = [
        productId,
        ...productDetailsPage.product.isSimilarTo?.map(getProductId) ?? [],
      ];
    }

    const [reviews] = await client.reviews({
      productId: productsToGetReviews as unknown as string, // FIXME: once PR is accepted by Deco, remove this cast
      productIds: productsToGetReviews, // Once PR is accepted the above line should be removed
      count: config?.count,
      offset: config?.offset,
      order: config?.order,
      // deno-lint-ignore no-explicit-any
    } as any) as unknown as Array<Reviews & { stats: number[] }>; // FIXME: once PR is accepted by Deco, remove this cast

    const ratings = await client.ratings({
      productsIds: productsToGetReviews,
    });

    const aggregateRating = toRating(ratings);

    const review: ExtendedReview[] = reviews?.reviews?.map(toReview) ?? [];

    return {
      ...productDetailsPage,
      product: {
        ...productDetailsPage.product,
        review,
        aggregateRating: {
          ...aggregateRating,
          stats: reviews?.stats ?? [],
        } as ExtendedAggregateRating,
      },
    };
  };
}
