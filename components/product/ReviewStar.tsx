
import { AnatomyClasses, handleClasses } from "../../sdk/styles.ts";

const anatomy = [
  "container",
  "title",
  "stars",
  "opinionsText",
] as const;

type Styles = AnatomyClasses<typeof anatomy[number]>;

export interface Props {
    title?:string ; 
    reviewCount: number;
    ratingValue: number;
    opinionsText: string;
    classes?:Styles;
}


function ReviewStar({ ratingValue,reviewCount,title="Avaliações",opinionsText="opniões",classes }: Props) {
  return (
    <div class={handleClasses(classes?.container) || "flex flex-col"}>
            <span class={handleClasses(classes?.title) || "text-14 font-body mt-5 mb-4"}>{title}</span>
            <div class="flex flex-row">
              <div class="rating">
                {ratingValue == 1 ? ( <input type="radio" name="rating-5" class={handleClasses(classes?.stars) || "mask mask-star"} checked/>):(<input type="radio" name="rating-5" class="mask mask-star"/>)}
                {ratingValue == 2 ? ( <input type="radio" name="rating-5" class={handleClasses(classes?.stars) || "mask mask-star"} checked/>):(<input type="radio" name="rating-5" class="mask mask-star"/>)}
                {ratingValue == 3 ? ( <input type="radio" name="rating-5" class={handleClasses(classes?.stars) || "mask mask-star"} checked/>):(<input type="radio" name="rating-5" class="mask mask-star"/>)}
                {ratingValue == 4 ? ( <input type="radio" name="rating-5" class={handleClasses(classes?.stars) || "mask mask-star"} checked/>):(<input type="radio" name="rating-5" class="mask mask-star"/>)}
                {ratingValue == 5 ? ( <input type="radio" name="rating-5" class={handleClasses(classes?.stars) || "mask mask-star"} checked/>):(<input type="radio" name="rating-5" class="mask mask-star"/>)}

              </div>
              <span class={handleClasses(classes?.opinionsText) || "text-12 font-body ml-3"}>{reviewCount} opiniões</span>
            </div>
      </div>
  );
}

export default ReviewStar;
