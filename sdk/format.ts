const formatters = new Map<string, Intl.NumberFormat>();

function formatter({
  currency,
  locale,
  style = "currency",
  maximumFractionDigits = 2,
}: {
  currency: string;
  locale: string;
  style?: "currency" | "percent";
  maximumFractionDigits?: number;
}) {
  const key = `${currency}::${locale}::${style}::${maximumFractionDigits}`;

  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat(locale, {
        style,
        currency,
        maximumFractionDigits,
      }),
    );
  }

  return formatters.get(key)!;
}

export function formatPrice({
  price,
  currency = "BRL",
  locale = "pt-BR",
  maximumFractionDigits = 2,
}: {
  price: number | undefined;
  currency?: string;
  locale?: string;
  maximumFractionDigits?: number;
}) {
  return price
    ? formatter({ currency, locale, maximumFractionDigits }).format(price)
    : null;
}

export function formatPercent({
  savings,
  percentageStyle = "locale",
  currency = "BRL",
  locale = "pt-BR",
  maximumFractionDigits = 0,
}: {
  savings: number;
  percentageStyle?: "compact" | "locale";
  currency?: string;
  locale?: string;
  maximumFractionDigits?: number;
}) {
  if (!savings) {
    return null;
  }

  const formattedSavingsPercentage = formatter({
    currency,
    locale,
    style: "percent",
    maximumFractionDigits,
  }).format(savings);

  const NON_BREAKING_SPACE_CHAR = String.fromCharCode(160);

  if (percentageStyle === "compact") {
    return formattedSavingsPercentage.replace(
      `${NON_BREAKING_SPACE_CHAR}%`,
      "%",
    );
  }

  return formattedSavingsPercentage;
}
