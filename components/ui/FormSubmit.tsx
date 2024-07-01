import { ComponentChildren, JSX } from "preact";

import Spinner from "deco-components/components/ui/Spinner.tsx";

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
    >
      {isLoading ? <Spinner size={16} /> : children}
    </button>
  );
}

export default FormSubmit;
