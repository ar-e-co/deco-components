import { JSX } from "preact";
import { useEffect } from "preact/hooks";

import { clx } from "deco-components/sdk/clx.ts";
import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

const anatomy = [
  "input",
  "input--error",
  "errorMessage",
] as const;

export type FormInputStyles = AnatomyClasses<
  typeof anatomy[number]
>;

export type FormInputProps =
  & JSX.HTMLAttributes<HTMLInputElement>
  & {
    classes?: FormInputStyles;
    value?: string;
    error?: string | null;
  };

function FormInput({
  classes,
  value,
  error,
  ...props
}: FormInputProps) {
  useEffect(() => {
  }, []);

  return (
    <>
      <input
        class={handleClasses(
          "border border-transparent outline-none py-[calc(0.5rem-1px)] px-4",
          classes?.input,
          error ? clx("[&&]:border-red-500", classes?.["input--error"]) : "",
        )}
        {...props}
      />

      {!!error && (
        <span
          class={handleClasses(
            "block mt-0.5 text-sm text-red-500",
            classes?.errorMessage,
          )}
        >
          {error}
        </span>
      )}
    </>
  );
}

export default FormInput;
