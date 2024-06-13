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
  "cardAfter",
] as const;

type ImageWithTextClasses = AnatomyClasses<typeof anatomy[number]>;

interface Props extends Omit<ImageProps, "alt"> {
  cardTitle: string;
  classes?: ImageWithTextClasses;
  width: number;
  height: number;
  link?: string;
}

function ImageWithText({
  width,
  height,
  classes,
  cardTitle,
  link,
  src,
}: Props) {
  return (
    <a
      href={link}
      class={handleClasses("group relative", classes?.container)}
    >
      <DecoImage
        src={src}
        width={width}
        height={height}
        alt={cardTitle}
        class={handleClasses("w-full h-full object-cover", classes?.image)}
        loading="lazy"
      />
      {cardTitle && (
        <div
          class={handleClasses(
            "absolute w-fit ml-4 mb-3.5 bottom-0 left-0 right-0 ",
            classes?.cardTitle,
          )}
        >
          <div
            class={handleClasses(
              "flex w-auto font-medium leading-tight text-gray-1000 items-center",
              classes?.cardText,
            )}
          >
            {cardTitle}
            <Icon
              class="h-auto ml-1.5 transition-all ease-in-out duration-250 group-hover:rotate-45"
              id="ArrowPointingOut"
              width={12}
              height={12}
            />
          </div>
          <div
            class={handleClasses(
              "after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-gray-1000 after:transition-all after:duration-200 after:ease-in-out group-hover:after:left-0 group-hover:after:w-full",
              classes?.cardAfter,
            )}
          >
          </div>
        </div>
      )}
    </a>
  );
}

export default ImageWithText;
