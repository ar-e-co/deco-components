import { ComponentChildren } from "preact";
import { batch, Signal, signal } from "@preact/signals";

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
    hideToast();

    displayToast.open.value = true;
    displayToast.message.value = message;

    setTimeout(() => {
      hideToast();
    }, timeout);
  });
}

export function useToastUI() {
  return {
    displayToast,
    showToast,
    hideToast,
  };
}
