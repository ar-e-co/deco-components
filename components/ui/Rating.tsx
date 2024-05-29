import { AnatomyClasses } from "deco-components/sdk/styles.ts";
import Icon, { AvailableIcons, Props as IconProps } from "./Icon.tsx";
import { clx } from "deco-components/sdk/clx.ts";

const anatomy = [
  "container",
  "container--inner",
  "icon",
] as const;

type Styles = AnatomyClasses<typeof anatomy[number]>;

export interface Props {
  value: number;
  classes?: Styles;
  maxRating?: number;
  iconEmpty?: AvailableIcons;
  iconFull?: AvailableIcons;
  iconSize?: number;
  iconProps?: Partial<IconProps>;
}

/**
 * Stars rating component
 * @description Icons should be added to adminIcons.ts before using them
 */
function Rating({
  classes,
  maxRating = 5,
  value,
  iconEmpty = "StarOutline",
  iconFull = "StarSolid",
  iconSize = 16,
  iconProps,
}: Props) {
  const baseContainerClasses = "flex gap-1.5";
  const ratingWidth = parseFloat((value / maxRating).toFixed(2)) * 100;

  return (
    <div class={clx("relative !w-fit", classes?.container)}>
      <div class={clx(baseContainerClasses, classes?.["container--inner"])}>
        {Array.from({ length: maxRating }, () => (
          <Icon
            id={iconEmpty}
            width={iconSize}
            height={iconSize}
            strokeWidth={1}
            class={classes?.icon}
            {...iconProps}
          />
        ))}
      </div>

      <div
        class="absolute top-0 left-0 overflow-hidden"
        style={{ width: `${ratingWidth}%` }}
      >
        <div
          class={clx(
            "!w-fit",
            baseContainerClasses,
            classes?.["container--inner"],
          )}
        >
          {Array.from({ length: maxRating }, () => (
            <Icon
              id={iconFull}
              width={iconSize}
              height={iconSize}
              strokeWidth={1}
              class={classes?.icon}
              {...iconProps}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Rating;
