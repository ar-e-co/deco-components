export function getRecommendedPercentage(stats: number[]) {
  const RECOMMENDED_THRESHOLD = 2; // above 3

  const reviewsCount = stats.reduce((acc, cur) => acc + cur, 0);
  const ratesAboveThreshold = stats.slice(RECOMMENDED_THRESHOLD).reduce(
    (acc, cur) => acc + cur,
    0,
  );

  const recommendationPercentage = Math.round(
    (ratesAboveThreshold / reviewsCount) * 100,
  );

  return recommendationPercentage;
}
