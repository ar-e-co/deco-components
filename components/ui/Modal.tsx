import { useSignal } from "@preact/signals";
import { ComponentChildren } from "preact";
import { useEffect } from "preact/hooks";

import { useId } from "deco-components/sdk/useId.ts";

export interface Props {
  onClose?: () => void;
  open?: boolean;
  class?: string;
  style?: string;
  children?: ComponentChildren;
  loading?: "eager" | "lazy";
}

function Modal(props: Props) {
  const {
    children,
    open,
    onClose,
    loading = "lazy",
  } = props;
  const lazy = useSignal(loading === "lazy" && !open);
  const id = useId();

  useEffect(() => {
    const handler = (e: KeyboardEvent) =>
      (e.key === "Escape" || e.keyCode === 27) && open && onClose?.();

    addEventListener("keydown", handler);

    return () => {
      removeEventListener("keydown", handler);
    };
  }, [open]);

  useEffect(() => {
    lazy.value = false;
  }, []);

  return (
    <>
      <input
        id={id}
        checked={open}
        type="checkbox"
        class="modal-toggle"
        onChange={(e) => e.currentTarget.checked === false && onClose?.()}
      />

      <dialog class="modal box-border overflow-hidden">
        <div 
          class="z-0 bg-black opacity-50 absolute top-0 left-0 right-0 bottom-0" 
          onClick={onClose}
        />

        <div class="z-1">
          {!lazy.value && children}
        </div>
      </dialog>
    </>
  );
}

export default Modal;
