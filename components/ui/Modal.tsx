import { useSignal } from "@preact/signals";
import { ComponentChildren } from "preact";
import { useEffect } from "preact/hooks";

import { useId } from "deco-components/sdk/useId.ts";
import { AnatomyClasses } from "deco-components/sdk/styles.ts";
import { clx } from "deco-components/sdk/clx.ts";

const anatomy = [
  "backdrop",
  "body",
] as const;

export interface Props {
  onClose?: () => void;
  open?: boolean;
  children?: ComponentChildren;
  loading?: "eager" | "lazy";
  classes?: AnatomyClasses<typeof anatomy[number]>;
}

function Modal({
  children,
  open,
  onClose,
  loading = "lazy",
  classes,
}: Props) {
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
        <div class="lg:fixed w-full h-full">
          <div class="relative w-full h-full flex justify-center items-center">
            <div
              class={clx(
                "z-0 bg-black opacity-50 absolute top-0 left-0 right-0 bottom-0",
                classes?.backdrop,
              )}
              onClick={onClose}
            />

            <div class={clx("z-10", classes?.body)}>
              {!lazy.value && children}
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default Modal;
