import { SimulationSla } from "deco-components/Shipping/sdk/Types.ts";
import { LogisticsInfo, ShippingSla } from "./Types.ts";
import { SelectedDeliveryChannel } from "apps/vtex/utils/types.ts";
import { getFastestSla, getCheapestSla } from "@vtex/estimate-calculator";
import { CHEAPEST_DELIVERY_NAME, FASTEST_DELIVERY_NAME } from "deco-components/Shipping/sdk/constants.ts";

const TIME_UNITS_MAP = {
  h: ["hora", "hora"],
  m: ["minuto", "minutos"],
  d: ["dia útil", "dias úteis"],
  bd: ["dia útil", "dias úteis"],
  today: "No mesmo dia",
};

const MONTHS = [
  "jan.",
  "fev.",
  "mar.",
  "abr.",
  "mai.",
  "jun.",
  "jul.",
  "ago.",
  "set.",
  "out.",
  "nov.",
  "dez.",
] as const;

const DAYS = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
] as const;

export function computeId(ids: string[]) {
  return ids.join(" -- ");
}

export function computePrice(prices: number[]) {
  return prices.reduce((acc, cur) => acc + cur, 0) / 100; // cents to currency
}

export function computeNumberOfPackages(options: LogisticsInfo[]) {
  return options
    .map((li) => li.selectedSla)
    .filter((selectedSla, i, v) =>
      Boolean(selectedSla) && v.indexOf(selectedSla) === i
    ).length;
}

export function stripNonNumericCharacters(str: string) {
  return str.replace(/[^\d*]/g, "");
}

export function isPostalCodeHidden(str: string) {
  if (str[0] === "*") {
    return str;
  }

  return str.replace(/[^\d]/g, "");
}

export function maskPostalCode(postalCode: string) {
  if (postalCode.length < 8) return postalCode;

  // receive a postal code xxxxxxx and insert the 6th position with a -
  return postalCode.replace(/(\d{5})(\d)/, "$1-$2");
}

export function calculateShippingEstimateDate(time: string) {
  const daysToAdd = Number(time.split(/[^\d]+/).join(""));

  const currentDate = new Date();
  let count = 0;

  while (count < daysToAdd) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dayOfWeek = currentDate.getDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }

  return {
    day: currentDate.getDate(),
    month: currentDate.getMonth() + 1,
    monthName: MONTHS[currentDate.getMonth()],
    dayName: DAYS[currentDate.getDay()],
  };
}

export function shippingEstimateToString(estimate: string) {
  const time = Number(estimate.split(/[^\d]+/).join(""));
  const timeUnit = estimate.split(/[\W\d]+/).join("");
  const deliveryInDays = timeUnit === "d" || timeUnit === "bd";

  if (deliveryInDays) {
    if (time === 0) {
      return TIME_UNITS_MAP.today;
    }

    return `${time} ${TIME_UNITS_MAP[timeUnit][time > 1 ? 1 : 0]}`;
  }

  return TIME_UNITS_MAP.today;
}

type MessageValues = {
  [key: string]: {
    value: string | number;
    classes?: string;
  };
};

export function formatMessage(message: string, values: MessageValues) {
  return message.split(" ").map((word, i, v) => {
    const isLastItem = i === v.length - 1;
    const value = values[word];

    if (value) {
      return (
        <>
          <span class={value.classes ?? ""}>{value.value}</span>
          {isLastItem ? "" : " "}
        </>
      );
    }

    return isLastItem ? word : `${word} `;
  });
}

export function shippingEstimateToBD(estimate: string) {
  const time = Number(estimate.split(/[^\d]+/).join(""));
  const timeUnit = estimate.split(/[\W\d]+/).join("");

  if (timeUnit.toLowerCase() === "h") {
    if (time >= 24) {
      return `${Math.floor(time / 24)}bd`;
    }

    return "0bd";
  }

  return estimate.replace(/b/gi, "").replace(/d/gi, "bd");
}

function groupStoresByShippingEstimate(pickupSlas: ShippingSla[]) {
  const uniqPickupSlasObj: Record<string, ShippingSla> = {};

  // Since the simulation is only for one item, we can assume that all slas have the same pickup store.
  // If we ever have to support multiple items, we need to change this logic
  pickupSlas.forEach((sla) => {
    const key = sla.id;
    const pickupSla = uniqPickupSlasObj[key];

    if (pickupSla) {
      return;
    }

    uniqPickupSlasObj[key] = {
      ...sla,
      shippingEstimate: shippingEstimateToBD(sla.shippingEstimate),
    };
  })

  const uniqPickupSlas = Object.values(uniqPickupSlasObj);

  const uniqShippingEstimates = uniqPickupSlas
    .map((sla) => sla.shippingEstimate)
    .filter((d, i, v) => !!d && v.indexOf(d) === i)

  // For each shipping estimate, we group the stores that have the same
  const groupedPickupLocations = uniqShippingEstimates.reduce((acc: SimulationSla[], cur) => {
    const slasWithThisShippingEstimate = uniqPickupSlas
      .filter((sla) => sla.shippingEstimate === cur);

    return [
      ...acc,
      {
        id: cur,
        friendlyName: "Retirada em Loja",
        price: slasWithThisShippingEstimate[0].price,
        shippingEstimate: cur,
        deliveryChannel: SelectedDeliveryChannel.PickupInPoint,
        locations: slasWithThisShippingEstimate.map(d => d.pickupStoreInfo),
      },
    ];
  }, []);

  return groupedPickupLocations;
}

export function aggregateSimulationResults(logisticsInfo: LogisticsInfo[]) {
  const slas = logisticsInfo?.[0]?.slas ?? []; // only one item

  if (slas?.length === 0) {
    return null;
  }

  const pickupSlas = slas
    .filter((sla) => sla.deliveryChannel === SelectedDeliveryChannel.PickupInPoint);

  const deliverySlas = slas
    .filter((sla) => sla.deliveryChannel === SelectedDeliveryChannel.Delivery);

  const groupedPickup = groupStoresByShippingEstimate(pickupSlas);

  let cheapestOption: SimulationSla = getCheapestSla(deliverySlas ?? []);
  cheapestOption = {
    ...cheapestOption,
    id: cheapestOption?.id ?? "cheapest",
    shippingEstimate: shippingEstimateToBD(cheapestOption?.shippingEstimate ?? ""),
    friendlyName: CHEAPEST_DELIVERY_NAME,
    deliveryChannel: SelectedDeliveryChannel.Delivery,
  }

  let fastestOption: SimulationSla | null = getFastestSla(deliverySlas ?? []);
  fastestOption = {
    ...fastestOption,
    id: fastestOption?.id ?? "fastest",
    shippingEstimate: shippingEstimateToBD(fastestOption?.shippingEstimate ?? ""),
    friendlyName: FASTEST_DELIVERY_NAME,
    deliveryChannel: SelectedDeliveryChannel.Delivery,
  }

  const cheapestIsFastest = cheapestOption?.id === fastestOption?.id 
    || cheapestOption?.price === fastestOption?.price
    || cheapestOption?.shippingEstimate === fastestOption?.shippingEstimate;

  if(cheapestIsFastest) {
    cheapestOption = {
      ...fastestOption,
      id: cheapestOption.id,
      friendlyName: cheapestOption.friendlyName,
    }

    fastestOption = null;
  }

  return {
    cheapestOption,
    fastestOption,
    pickupOptions: groupedPickup,
  }
}

