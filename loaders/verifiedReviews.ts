import { AppContext } from "deco-components/mod.ts";
import {
  createClient,
  PaginationOptions,
} from "apps/verified-reviews/utils/client.ts";
import { Reviews } from "apps/verified-reviews/utils/types.ts";

import { ExtendedReview } from "deco-components/sdk/verified-reviews/types.ts";
import { toReview } from "deco-components/sdk/verified-reviews/transform.ts";

export type Props = PaginationOptions & {
  productsIds: string[];
};

/**
 * @title Opiniões verificadas - Full Review for Product (Ratings and Reviews)
 */
export default async function productReviews(
  config: Props,
  _req: Request,
  ctx: AppContext,
): Promise<ExtendedReview[] | null> {
  const client = createClient({ ...ctx?.configVerifiedReviews });

  if (!client) {
    return null;
  }

  const reviewsResponse = (await client.reviews({
    productId: config.productsIds, // FIXME: once PR is accepted by Deco, remove this cast
    productIds: config.productsIds, // Once PR is accepted the above line should be removed
    count: config?.count,
    offset: config?.offset,
    order: config?.order,
    // deno-lint-ignore no-explicit-any
  } as any) ?? []) as unknown as Array<Reviews & { stats: number[] }>; // FIXME: once PR is accepted by Deco, remove this cast

  const reviews = reviewsResponse?.[0] ?? [];
  return reviews.reviews?.map(toReview) ?? [];
}
