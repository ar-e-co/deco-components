import { ComponentChildren, JSX } from "preact";

import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";
import Spinner from "deco-components/components/ui/Spinner.tsx";

const anatomy = ["button"] as const;

export type FormSubmitStyles = AnatomyClasses<
  typeof anatomy[number]
>;

export type FormSubmitProps =
  & Partial<JSX.HTMLAttributes<HTMLButtonElement>>
  & {
    children?: ComponentChildren;
    isLoading?: boolean;
  };

function FormSubmit({
  children = "Enviar",
  isLoading,
  class: _class,
  ...props
}: FormSubmitProps) {
  return (
    <button
      {...props}
      type="submit"
      class={handleClasses(
        "inline-block h-fit py-2 px-6 bg-primary disabled:bg-gray-300",
        _class as string,
      )}
    >
      {isLoading ? <Spinner size={16} /> : children}
    </button>
  );
}

export default FormSubmit;
