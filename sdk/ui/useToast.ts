import { batch, Signal, signal } from "@preact/signals";
import { ComponentChildren } from "preact";

type ToastUI = {
  message: Signal<ComponentChildren>;
  open: Signal<boolean>;
};

const displayToast: ToastUI = {
  open: signal(false),
  message: signal(""),
};

function hideToast() {
  batch(() => {
    displayToast.open.value = false;
    displayToast.message.value = "";
  });
}

function showToast(message: ComponentChildren, timeout = 5000) {
  batch(() => {
    displayToast.open.value = true;
    displayToast.message.value = message;

    setTimeout(() => {
      hideToast();
    }, timeout);
  });
}

export function useToast() {
  return {
    displayToast,
    showToast,
    hideToast,
  };
}
