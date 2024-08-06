import { Slide } from "./types.ts";

/** @title Header Bar */
export interface HeaderBarProps {
  /**
   * @title Intervalo entre slides (ms)
   * @default 7000
   */
  interval: number;
  slides: Slide[];
}
