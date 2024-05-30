import {
  AggregateRating,
  ProductDetailsPage,
  Review,
} from "apps/commerce/types.ts";
import { ExtensionOf } from "apps/website/loaders/extension.ts";

import { AppContext } from "deco-components/mod.ts";
import {
  createClient,
  getProductId,
  PaginationOptions,
} from "apps/verified-reviews/utils/client.ts";
import {
  getRatingProduct,
  toReview,
} from "apps/verified-reviews/utils/transform.ts";
import { Reviews } from "apps/verified-reviews/utils/types.ts";

export type Props = PaginationOptions & {
  aggregateSimilarProducts?: boolean;
};

export interface ExtendedReview extends Review {
  orderDate: string;
}

export interface ExtendedAggregateRating extends AggregateRating {
  stats: number[];
}

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

    const [reviews] = await client.reviews({
      productId,
      count: config?.count,
      offset: config?.offset,
      order: config?.order,
    }) as unknown as Array<Reviews & { stats: number[] }>; // FIXME: once PR is accepted by Deco, remove this cast

    const ratings = await client.ratings({
      productsIds: [productId],
    });

    const aggregateRating: AggregateRating | undefined = getRatingProduct({
      ratings,
      productId,
    });

    const review: ExtendedReview[] = reviews?.reviews?.map((review) => ({
      ...toReview(review),
      orderDate: review.order_date,
    })) ?? [];

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
