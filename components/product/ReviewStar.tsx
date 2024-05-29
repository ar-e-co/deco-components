import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";
import Icon from "../../components/ui/Icon.tsx";

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
    classes?:Styles;
}

function ReviewStar({ 
  ratingValue = 0, 
  reviewCount, 
  classes,
  title = "Avaliações", 
}: Props) {

  let parteFracionaria = (ratingValue - Math.floor(ratingValue));
  let widthPercentage = 16 * parteFracionaria
  return (
    <div class={handleClasses("flex flex-col",classes?.container)}>
      <span class={handleClasses( "text-14 font-body mt-5 mb-4",classes?.title)}>{title}</span>

    <div class="flex flex-row gap-[6px]">

      <div class="relative">
      {ratingValue >= 1 ?
      (
      <Icon
          id={"starsBlack"}
          width={16}
          height={16}
          strokeWidth={1}
          class="object-contain bg-cover"/>
      ):(
      <>
          <Icon
              id={"starsWhite"}
              width={16}
              height={16}
              strokeWidth={1}/>

          <div class="absolute top-0 left-0">  
              <Icon
              id={"starsBlack"}
              width={widthPercentage}
              height={16}
              strokeWidth={1}
              class="object-contain bg-cover"
              />
          </div>
      </>
      )
      }  
      </div>
      <div class="relative">
      {ratingValue >= 2 ?
      (
      <Icon
          id={"starsBlack"}
          width={16}
          height={16}
          strokeWidth={1}
          class="object-contain bg-cover"/>
      ):(
      <>
          <Icon
              id={"starsWhite"}
              width={16}
              height={16}
              strokeWidth={1}/>

          <div class="absolute top-0 left-0">  
              <Icon
              id={"starsBlack"}
              width={widthPercentage}
              height={16}
              strokeWidth={1}
              class="object-contain bg-cover"
              />
          </div>
      </>
      )
      }  
        
      </div>
      <div class="relative">
      {ratingValue >= 3 ?
      (
      <Icon
          id={"starsBlack"}
          width={16}
          height={16}
          strokeWidth={1}
          class="object-contain bg-cover"/>
      ):(
      <>
          <Icon
              id={"starsWhite"}
              width={16}
              height={16}
              strokeWidth={1}/>

          <div class="absolute top-0 left-0">  
              <Icon
              id={"starsBlack"}
              width={widthPercentage}
              height={16}
              strokeWidth={1}
              class="object-contain bg-cover"
              />
          </div>
      </>
      )
      }  
      </div>
      <div class="relative">
      {ratingValue >= 4 ?
      (
      <Icon
          id={"starsBlack"}
          width={16}
          height={16}
          strokeWidth={1}
          class="object-contain bg-cover"/>
      ):(
      <>
          <Icon
              id={"starsWhite"}
              width={16}
              height={16}
              strokeWidth={1}/>

          <div class="absolute top-0 left-0">  
              <Icon
              id={"starsBlack"}
              width={widthPercentage}
              height={16}
              strokeWidth={1}
              class="object-contain bg-cover"
              />
          </div>
      </>)}

      </div>
      <div class="relative">
      {ratingValue >= 5 ?
      (
      <Icon
          id={"starsBlack"}
          width={16}
          height={16}
          strokeWidth={1}
          class="object-contain bg-cover"/>
      ):(
      <>
          <Icon
              id={"starsWhite"}
              width={16}
              height={16}
              strokeWidth={1}/>

          <div class="absolute top-0 left-0">  
              <Icon
              id={"starsBlack"}
              width={widthPercentage}
              height={16}
              strokeWidth={1}
              class="object-contain bg-cover"
              />
          </div>
      </>
      )
      }  
        
      </div>
          <span class={handleClasses(classes?.opinionsText) || "text-12 font-body ml-3"}>{reviewCount} opiniões</span>
      </div>
      </div>
  );
}

export default ReviewStar;
