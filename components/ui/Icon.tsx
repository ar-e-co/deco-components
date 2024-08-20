import { asset } from "$fresh/runtime.ts";
import type { JSX } from "preact";

export type AvailableIcons =
  | "Alert"
  | "AlertError"
  | "AlertInfo"
  | "AlertSuccess"
  | "AlertWarning"
  | "AlignCenter"
  | "AlignJustified"
  | "AlignLeft"
  | "AlignRight"
  | "ArrowLeft"
  | "ArrowPointingOut"
  | "ArrowRight"
  | "ArrowRightColor"
  | "ArrowRightLight"
  | "ArrowRightWhite"
  | "ArrowsPointingOut"
  | "Bars3"
  | "Bars3Simples"
  | "CartBag"
  | "Center"
  | "ChevronDown"
  | "ChevronLeft"
  | "ChevronRight"
  | "ChevronUp"
  | "Close"
  | "CreditCards"
  | "Deco"
  | "Default"
  | "Diners"
  | "Discord"
  | "Discount"
  | "Elo"
  | "Elos"
  | "Facebook"
  | "FilterList"
  | "GlassSimples"
  | "Heart"
  | "HelpIcon"
  | "IconLocation"
  | "IconPerson"
  | "Instagram"
  | "Left"
  | "Lettercase"
  | "Linkedin"
  | "LogoSymbol"
  | "Lowercase"
  | "MagnifyingGlass"
  | "MapPin"
  | "Mastercard"
  | "Mastercards"
  | "Message"
  | "Minus"
  | "Phone"
  | "Pix"
  | "Pixs"
  | "Plus"
  | "QuestionMarkCircle"
  | "Return"
  | "Right"
  | "RightArrowSimples"
  | "RightArrowSmall"
  | "RightArrowSmallSimples"
  | "Ruler"
  | "ShoppingCart"
  | "SideToSide"
  | "Star"
  | "StarOutline"
  | "StarSolid"
  | "Tiktok"
  | "Trash"
  | "Truck"
  | "Twitter"
  | "Uppercase"
  | "User"
  | "UserSimples"
  | "Visa"
  | "Visas"
  | "WhatsApp"
  | "XMark"
  | "XSimples"
  | "Zoom"
  | "glassSimples2"
  | "share";

export interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  /**
   * Symbol id from element to render. Take a look at `/static/icons.svg`.
   *
   * Example: <Icon id="Bell" />
   */
  id: AvailableIcons;
  size?: number;
}

function Icon(
  { id, strokeWidth = 16, size, width, height, ...otherProps }: Props,
) {
  return (
    <svg
      {...otherProps}
      width={width ?? size}
      height={height ?? size}
      strokeWidth={strokeWidth}
    >
      <use href={asset(`/sprites.svg#${id}`)} />
    </svg>
  );
}

export default Icon;
