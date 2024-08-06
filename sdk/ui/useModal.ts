/**
 * This file takes care of global app side effects,
 * like clicking on add to cart and the cart modal being displayed
 */

import { batch, Signal, signal } from "@preact/signals";
import { ComponentChildren } from "preact";

type ModalUI = {
  open: Signal<boolean>;
  children: Signal<ComponentChildren | null>;
};

const displayModal: ModalUI = {
  open: signal(false),
  children: signal(null),
};

function openModal(children: ComponentChildren) {
  batch(() => {
    displayModal.open.value = true;
    displayModal.children.value = children;
  });
}

function closeModal() {
  batch(() => {
    displayModal.open.value = false;
    displayModal.children.value = null;
  });
}

export function useModal() {
  return {
    displayModal,
    openModal,
    closeModal,
  };
}
