import { ChangeEvent } from "preact/compat";

export function stopBubblingUp(event: ChangeEvent<HTMLElement>) {
  event.preventDefault();
  event.stopPropagation();
}
