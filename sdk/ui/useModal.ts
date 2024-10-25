/**
 * This file takes care of global app side effects,
 * like clicking on add to cart and the cart modal being displayed
 */

import { batch, Signal, signal } from "@preact/signals";
import { ComponentChildren } from "preact";
import { Props } from "deco-components/components/ui/GlobalUI/Modal.tsx";

type ModalUI = {
  open: Signal<boolean>;
  children: Signal<ComponentChildren | null>;
  props?: Partial<Props>;
};

const displayModal: ModalUI = {
  open: signal(false),
  children: signal(null),
  props: undefined,
};

function openModal(children: ComponentChildren, props?: Partial<Props>) {
  batch(() => {
    displayModal.props = { ...props };
    displayModal.open.value = true;
    displayModal.children.value = children;
  });
}

function closeModal() {
  batch(() => {
    displayModal.props = undefined;
    displayModal.open.value = false;
    displayModal.children.value = null;
  });
}

export function useModalUI() {
  return {
    displayModal,
    openModal,
    closeModal,
  };
}
