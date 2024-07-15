import { ComponentChildren } from "preact";
import { clx } from "deco-components/sdk/clx.ts";

import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

const anatomy = [
  "active",
  "disabled",
  "default",
  "container",
  "text",
];

export type AvatarStyles = AnatomyClasses<typeof anatomy[number]>;

export type AvatarVariants = "active" | "disabled" | "default" | "none";

export interface Props {
  variant?: AvatarVariants;
  classes?: AvatarStyles;
  children: ComponentChildren;
}

function Avatar({ variant = "none", classes, children }: Props) {
  const variants = {
    active: handleClasses(
      "bg-primary [&]:text-base-200 [&]:ring-primary",
      classes?.active,
    ),
    disabled: handleClasses(
      "[&]:hover:ring-base-200 cursor-default after:absolute after:top-1/2 after:h-0.5 after:-left-[5%] after:bg-primary after:w-[110%] after:block after:rotate-[30deg] after:opacity-30 after:content-['']",
      classes?.disabled,
    ),
    none: "",
  };

  const containerClasses = handleClasses(
    "relative transition-all text-base-content ring-1 ring-base-200 hover:ring-base-content  rounded-full flex items-center justify-center w-13 lg:w-12 h-8 lg:h-7",
    classes?.container,
  );
  const variantClasses = variants[variant as keyof typeof variants];

  return (
    <div class={clx(containerClasses, variantClasses)}>
      <div class="relative transition-all text-base-content ring-1 ring-base-200 hover:ring-base-content  rounded-full flex items-center justify-center w-13 lg:w-12 h-8 lg:h-7 hidden">
      </div>
      <span class={classes?.text}>
        {children}
      </span>
    </div>
  );
}

export default Avatar;
