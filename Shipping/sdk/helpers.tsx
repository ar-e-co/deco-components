import { LogisticsInfo } from "./Types.ts";

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
