import DecoImage, {
  Props as ImageProps,
} from "apps/website/components/Image.tsx";
import Icon from "deco-components/components/ui/Icon.tsx";
import { AnatomyClasses, handleClasses } from "../../sdk/styles.ts";

const anatomy = [
  "container",
  "link",
  "image",
  "cardTitle",
  "cardText",
] as const;

type ImageWithTextClasses = AnatomyClasses<typeof anatomy[number]>;

interface Props extends Omit<ImageProps, "alt"> {
  cardTitle: string;
  classes?: ImageWithTextClasses;
  cardText?: string;
}

function ImageWithText({
  width,
  height,
  classes,
  cardTitle,
}: Props) {
  const aspectRatio = width / height;
  const paddingTop = `${parseFloat((1 / aspectRatio).toFixed(2)) * 100}%`;

  return (
    <a
      href={classes?.link}
      class={handleClasses("group relative", classes?.container)}
      style={{ paddingTop }}
    >
      <DecoImage
        src={classes?.image as string}
        width={width}
        height={height}
        alt={cardTitle}
        class={handleClasses("w-full h-full object-cover", classes?.image)}
        loading={"lazy"}
      />
      {cardTitle && (
        <div class={handleClasses("absolute w-fit ml-4 mb-3.5 bottom-0 left-0 right-0 ")}>
          <div class="flex w-auto gap-1.5 font-medium leading-tight text-gray-1000 items-center">
            {cardTitle}
            <Icon
              class="h-auto transition-all ease-in-out duration-250 group-hover:rotate-45"
              id="ArrowPointingOut"
              width={12}
              height={12}
            />
          </div>
          <div class="after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-1000 after:transition-all after:duration-200 after:ease-in-out group-hover:after:left-0 group-hover:after:w-full">
          </div>
        </div>
      )}
    </a>
  );
}

export default ImageWithText;
