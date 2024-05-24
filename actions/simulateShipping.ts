import { Props as ShippingSimulationProps } from 'apps/vtex/actions/cart/simulation.ts';
import { VTEXContext } from 'apps/compat/std/mod.ts';
import { SelectedDeliveryChannel } from "deco-components/Shipping/sdk/Types.ts";
import { aggregateSimulationResults } from "deco-components/Shipping/sdk/helpers.tsx";

export interface ShippingSimulationSLA {
  id: string;
  friendlyName: string;
  pickupOptions?: string[];
  shippingEstimate: string;
  deliveryChannel: SelectedDeliveryChannel
  price?: number;
}

export interface Props extends ShippingSimulationProps {}

async function simulateShipping(
  props: Props,
  _req: Request,
  ctx: VTEXContext,
): Promise<ShippingSimulationSLA[]> {
  try {
    const results = await ctx.invoke.vtex.actions.cart.simulation(props);
    const { cheapestOption, fastestOption, pickupOptions = [] } = aggregateSimulationResults(results?.logisticsInfo ?? []) ?? {};

    // fallback, shouldn't happen
    if(!cheapestOption) {
      const slas = results?.logisticsInfo?.[0]?.slas ?? [];

      return slas.map((sla) => ({
        id: sla.id,
        friendlyName: sla.deliveryChannel === SelectedDeliveryChannel.Delivery ? sla.name : sla.pickupStoreInfo?.friendlyName,
        pickupPoints: [],
        shippingEstimate: sla.shippingEstimate,
        deliveryChannel: sla.deliveryChannel,
        price: sla.price,
      })) as ShippingSimulationSLA[];
    }

    const cheapest: ShippingSimulationSLA = {
      id: cheapestOption.id,
      friendlyName: cheapestOption.friendlyName,
      shippingEstimate: cheapestOption.shippingEstimate ?? "",
      deliveryChannel: SelectedDeliveryChannel.Delivery,
      price: cheapestOption.price,
      pickupOptions: [],
    }

    const fastest: ShippingSimulationSLA | null = fastestOption ? {
      id: fastestOption.id,
      friendlyName: fastestOption.friendlyName,
      shippingEstimate: fastestOption.shippingEstimate ?? "",
      deliveryChannel: SelectedDeliveryChannel.Delivery,
      price: fastestOption.price,
      pickupOptions: [],
    } : null

    const pickup: ShippingSimulationSLA[] = pickupOptions.map((option) => ({
      id: option.id,
      friendlyName: option.friendlyName,
      shippingEstimate: option.shippingEstimate ?? "",
      deliveryChannel: SelectedDeliveryChannel.PickupInPoint,
      price: option.price,
      pickupOptions: option.locations?.map((location) => location.friendlyName ?? "") ?? [],
    }))

    return [...pickup, cheapest].concat(fastest ? [fastest] : []);
  } catch (e) {
    return e;
  }
};

export default simulateShipping;
