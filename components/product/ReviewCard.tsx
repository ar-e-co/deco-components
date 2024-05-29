import Icon from "../../components/ui/Icon.tsx";
import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

const anatomy = [
  "container",
  "author",
  "stars",
  "date",
  "opinionText",
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
    const dataFormatada = (data: string) => {
        const regex = /(\d{4})-(\d{2})-(\d{2})/;
        const match = regex.exec(data);
      
        if (match) {
          return `${match[3]}/${match[2]}/${match[1]}`;
        }
      };

    let parteFracionaria = (ratingValue - Math.floor(ratingValue));
    let widthPercentage = 16 * parteFracionaria

  return (
    <div class={handleClasses(classes?.container) }>
   
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
    </div>

        <span class={handleClasses("mt-1 lg:min-h-24", classes?.opinionText)}>{reviewBody}</span>
    
        <div class="flex flex-col w-full text-12 lg:mt-3 font-body">
            <span class={handleClasses(classes?.author)}>{author}</span>
            <span class={handleClasses(classes?.date)}>Compra feita {dataFormatada(datePublished ?? "")}</span>
        </div>


    </div>
  );
}

export default ReviewCard;