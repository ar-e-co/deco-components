
export interface Props {
    reviewCount: number;
    ratingValue: number;
}

function ReviewStar({ ratingValue,reviewCount, }: Props) {
  return (
    <div class="flex flex-col">
            <span class="text-14 font-body mt-5 mb-4">Avaliações</span>
            <div class="flex flex-row">
              <div class="rating">
                {ratingValue == 1 ? ( <input type="radio" name="rating-5" class="mask mask-star" checked/>):(<input type="radio" name="rating-5" class="mask mask-star"/>)}
                {ratingValue == 2 ? ( <input type="radio" name="rating-5" class="mask mask-star" checked/>):(<input type="radio" name="rating-5" class="mask mask-star"/>)}
                {ratingValue == 3 ? ( <input type="radio" name="rating-5" class="mask mask-star" checked/>):(<input type="radio" name="rating-5" class="mask mask-star"/>)}
                {ratingValue == 4 ? ( <input type="radio" name="rating-5" class="mask mask-star" checked/>):(<input type="radio" name="rating-5" class="mask mask-star"/>)}
                {ratingValue == 5 ? ( <input type="radio" name="rating-5" class="mask mask-star" checked/>):(<input type="radio" name="rating-5" class="mask mask-star"/>)}
              </div>
              <span class="text-12 font-body ml-3">{reviewCount} opinião</span>
            </div>
      </div>
  );
}

export default ReviewStar;
