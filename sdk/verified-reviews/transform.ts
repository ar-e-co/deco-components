import {
  AggregateRating,
  Review as CommerceReview,
} from "apps/commerce/types.ts";
import { Ratings, Review } from "apps/verified-reviews/utils/types.ts";
import { toReview as decoToReview } from "apps/verified-reviews/utils/transform.ts";

export function toRating(
  ratings: Ratings | undefined,
): AggregateRating | undefined {
  if (!ratings) {
    return undefined;
  }

  let weightedRating = 0;
  let totalRatings = 0;

  Object.entries(ratings ?? {}).forEach(([_, [rating]]) => {
    const count = Number(rating.count);
    const value = Number(parseFloat(rating.rate).toFixed(1));

    totalRatings += count;
    weightedRating += count * value;
  });

  const aggregateRating: AggregateRating = {
    "@type": "AggregateRating",
    ratingCount: totalRatings,
    reviewCount: totalRatings,
    ratingValue: totalRatings > 0
      ? Number((weightedRating / totalRatings).toFixed(1))
      : 0,
  };

  return aggregateRating;
}

export function toReview(
  review: Review,
): CommerceReview & { orderDate: string } {
  return {
    ...decoToReview(review),
    orderDate: review.order_date,
  };
}
