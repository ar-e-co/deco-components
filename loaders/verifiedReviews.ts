import { AppContext } from "apps/verified-reviews/mod.ts";
import { Review } from "apps/commerce/types.ts";
import {
  createClient,
  PaginationOptions,
} from "apps/verified-reviews/utils/client.ts";
import { toReview } from "apps/verified-reviews/utils/transform.ts";

export type Props = PaginationOptions & {
  productId: string;
};

/**
 * @title Opiniões verificadas - Full Review for Product (Ratings and Reviews)
 */
export default async function productReviews(
  config: Props,
  _req: Request,
  ctx: AppContext,
): Promise<Review[] | null> {
  const client = createClient({ ...ctx });

  if (!client) {
    return null;
  }

  const [reviewsResponse] = await client.reviews({
    productId: config.productId,
    count: config?.count,
    offset: config?.offset,
    order: config?.order,
  });

  return reviewsResponse?.reviews?.map(toReview) ?? [];
}
