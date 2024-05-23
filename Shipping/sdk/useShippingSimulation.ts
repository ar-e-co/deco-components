import { Signal, signal } from "@preact/signals";
import type { SimulationOrderForm } from "apps/vtex/utils/types.ts";

import { PostalCode } from "./Types.ts";

export type ShippingCalculatorContextState = {
  // Form
  postalCodeSignal: Signal<PostalCode | null>;
  errorSignal: Signal<string | null>;
  loadingSignal: Signal<boolean>;
  simulationResultSignal: Signal<SimulationOrderForm | null>
};

// Mutable signals must be declared outside the hook
const postalCodeSignal = signal<PostalCode | null>(null);
const errorSignal = signal<string | null>(null);
const loadingSignal = signal<boolean>(false);
const simulationResultSignal = signal<SimulationOrderForm | null>(null);

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
