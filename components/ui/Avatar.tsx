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
    active: handleClasses(
      "text-base-200 bg-primary ring-1 ring-primary rounded-full lg:w-12 h-7 w-[52px] lg:h-[28px] text-12 text-center  flex justify-center ",
      classes?.active,
    ),
    disabled: handleClasses(
      "text-base-content ring-1 ring-base-200 relative rounded-full text-center text-12 flex justify-center  after:absolute after:top-1/2 after:h-[0.5px] after:-left-[5%] after:bg-primary after:w-[110%] after:block after:rotate-[30deg] after:content-[''] lg:w-12 h-7 w-[52px] lg:h-[28px]",
      classes?.disabled,
    ),
    default: handleClasses(
      "text-base-content  ring-1 ring-base-200 rounded-full lg:w-12 h-7 w-[52px] lg:h-[28px] text-center  text-12  flex justify-center",
      classes?.default,
    ),
  };

  return (
    <div class={handleClasses(classes?.container)}>
      <div
        class={`${variants[variant]}  hover:ring-base-content`}
      >
        <span class={handleClasses("my-auto", classes?.text)}>
          {content.substring(0, 3)}
        </span>
      </div>
    </div>
  );
}

export default Avatar;
