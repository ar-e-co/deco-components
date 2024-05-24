import { Signal, signal } from "@preact/signals";

import { PostalCode } from "./Types.ts";
import { ShippingSimulationSLA } from "deco-components/actions/simulateShipping.ts";

export type ShippingCalculatorContextState = {
  // Form
  postalCodeSignal: Signal<PostalCode | null>;
  errorSignal: Signal<string | null>;
  loadingSignal: Signal<boolean>;
  simulationResultSignal: Signal<ShippingSimulationSLA[]>
};

const postalCodeSignal = signal<PostalCode | null>(null);
const errorSignal = signal<string | null>(null);
const loadingSignal = signal<boolean>(false);
const simulationResultSignal = signal<ShippingSimulationSLA[]>([]);

const state: ShippingCalculatorContextState = {
  // Form
  postalCodeSignal,
  errorSignal,
  loadingSignal,
  simulationResultSignal,
};

export function useShippingSimulation() {
  return state;
}

export default useShippingSimulation;
