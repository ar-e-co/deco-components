
import { AnatomyClasses, handleClasses } from "../../sdk/styles.ts";

const anatomy = [
  "container",
  "title",
  "stars",
  "opinionsText",
] as const;

type Styles = AnatomyClasses<typeof anatomy[number]>;

export interface Props {
    ratingValue: number;
    reviewBody:string;
    classes?:Styles;
    author?: string;
    datePublished?:string;
}


function ReviewCard({ ratingValue,reviewBody,classes,datePublished,author }: Props) {
    const dataFormatada = (data) => {
        const regex = /(\d{4})-(\d{2})-(\d{2})/;
        const match = regex.exec(data);
      
        if (match) {
          return `${match[3]}/${match[2]}/${match[1]}`;
        }
      };
      
  return (
        <div class="flex flex-col w-full lg:w-1/5 lg:max-w-[290px] border-t border-black py-5 px-3 lg:h-44 text-14 font-body ">
            <div class="rating  rating-sm">
                {ratingValue == 1
                    ? (
                    <input
                        type="radio"
                        name="rating-5"
                        class="mask mask-star"
                        checked
                    />
                    )
                    : <input type="radio" name="rating-5" class="mask mask-star" />}
                {ratingValue == 2
                    ? (
                    <input
                        type="radio"
                        name="rating-5"
                        class="mask mask-star"
                        checked
                    />
                    )
                    : <input type="radio" name="rating-5" class="mask mask-star" />}
                {ratingValue == 3
                    ? (
                    <input
                        type="radio"
                        name="rating-5"
                        class="mask mask-star"
                        checked
                    />
                    )
                    : <input type="radio" name="rating-5" class="mask mask-star" />}
                {ratingValue == 4
                    ? (
                    <input
                        type="radio"
                        name="rating-5"
                        class="mask mask-star"
                        checked
                    />
                    )
                    : <input type="radio" name="rating-5" class="mask mask-star" />}
                {ratingValue == 5
                    ? (
                    <input
                        type="radio"
                        name="rating-5"
                        class="mask mask-star"
                        checked
                    />
                    )
                    : <input type="radio" name="rating-5" class="mask mask-star" />}
            </div>
                <span class="mt-1 lg:min-h-24 ">{reviewBody}</span>
            <div class="flex flex-col w-full text-12 mt-3 font-body">
                <span>{author}</span>
                <span>Compra feita {dataFormatada(datePublished)}</span>
            </div>
        </div>
  );
}

export default ReviewCard;