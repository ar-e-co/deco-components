import { AggregateRating, Review } from "apps/commerce/types.ts";

export interface ExtendedReview extends Review {
  orderDate: string;
}

export interface ExtendedAggregateRating extends AggregateRating {
  stats: number[];
}
