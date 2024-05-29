import { AnatomyClasses, handleClasses } from "../../sdk/styles.ts";

const anatomy = [
  "active",
  "disabled",
  "default",
  "container",
  "text",
];

export type AvatarStyles = AnatomyClasses<typeof anatomy[number]>;

export type AvatarVariants = "active" | "disabled" | "default";

export interface Props {
  variant?: AvatarVariants;
  content: string;
  classes?: AvatarStyles;
}

function Avatar({ content, variant = "default", classes }: Props) {
  const variants = {
    active: handleClasses(classes?.active) ||
      "text-base-200 bg-primary ring-1 ring-primary rounded-full px-5 py-1",
    disabled: handleClasses(classes?.disabled) ||
      `text-base-content ring-1 ring-base-300 relative rounded-full after:absolute after:top-1/2 after:h-[2px] after:-left-[5%] after:bg-primary after:w-[110%] after:block after:rotate-[20deg] after:content-[""] px-5 py-1`,
    default: handleClasses(classes?.default) ||
      "text-base-content bg-base-200 ring-1 ring-base-300 rounded-full px-5 py-1",
  };

  return (
    <div class={handleClasses("placeholder", classes?.container)}>
      <div
        class={`${variants[variant]}  hover:ring-base-content`}
      >
        <span class={classes?.text || ""}>
          {content.substring(0, 3)}
        </span>
      </div>
    </div>
  );
}

export default Avatar;
