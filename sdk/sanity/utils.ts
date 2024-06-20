import { SanityProjectConfig } from "deco-components/sdk/sanity/Types.ts";

export function buildSanityURL(config: SanityProjectConfig, query: string) {
  if (!config?.projectId) {
    throw new Error("projectId is required");
  }

  const projectId = config?.projectId;
  const enableCDN = config?.useCdn ?? true;
  const apiVersion = config?.apiVersion ?? "v2024-06-20";
  const dataset = config?.dataset ?? "production";

  const endpoint = `${projectId}.${enableCDN ? "apicdn" : "api"}.sanity.io`;
  const apiPath = `${apiVersion}/data/query/${dataset}`;

  return `https://${endpoint}/${apiPath}?query=${query}`;
}

export function buildSanityQuery({
  groq,
  variables,
  attributes,
  beforeAttributesOptions,
  afterAttributesOptions,
}: {
  groq: string;
  attributes?: string; // Which document attributes should be returned from Sanity
  variables?: Record<string, string | string[]>; // Variables to be used by Groq query
  beforeAttributesOptions?: string; // Groq options to be used before attributes object on query string
  afterAttributesOptions?: string; // Groq options to be used after attributes object on query string
}) {
  // Join everything in a single query string
  const query = [
    groq,
    beforeAttributesOptions,
    attributes,
    afterAttributesOptions,
  ]
    .filter(Boolean)
    .join("");

  // Parse sanity variables
  const joinedVariables = Object.entries(variables ?? {})
    .filter(([_, value]) => Boolean(value))
    .map(([key, value]) => {
      const isArray = Array.isArray(value);

      if (isArray) {
        const _value = value as string[];
        const encodedValue = _value.map(
          (v) => `"${encodeURIComponent(String(v))}"`,
        );

        return `$${key}=[${encodedValue.join(",")}]`;
      }

      const encodedValue = encodeURIComponent(String(value));

      return `$${key}="${encodedValue}"`;
    });

  // Join Groq string with variables
  return [`${encodeURIComponent(query)}`, ...joinedVariables].join("&");
}
