import type {
  SanityProjectConfig,
  SanityResponseLoader,
} from "deco-components/sdk/sanity/Types.ts";
import {
  buildSanityQuery,
  buildSanityURL,
} from "deco-components/sdk/sanity/utils.ts";
import { fetchAPI } from "apps/utils/fetch.ts";

/** @title Client Sanity */
export interface Props {
  /** @title Configurações de Projeto */
  config: SanityProjectConfig;
  /** @title Query GROQ */
  groq: string;
  /**
   * @title Atributos
   * @description Atributos do documento a serem retornados do Sanity
   */
  attributes?: string;
  /**
   * @title Variáveis
   * @description Variáveis a serem interpoladas na query Groq
   */
  variables?: Record<string, string | string[]>;
  /**
   * @title Opções (Antes)
   * @description Opções Groq a serem usadas antes do objeto de atributos na string de consulta
   */
  beforeAttributesOptions?: string;
  /**
   * @title Opções (Depois)
   * @description Opções Groq a serem usadas após o objeto de atributos na string de consulta
   */
  afterAttributesOptions?: string;
}

export default async function loader({
  config,
  groq,
  attributes,
  variables,
  beforeAttributesOptions,
  afterAttributesOptions,
}: Props): Promise<SanityResponseLoader> {
  const query = buildSanityQuery({
    groq,
    attributes,
    variables,
    beforeAttributesOptions,
    afterAttributesOptions,
  });

  const url = buildSanityURL(config, query);
  const response: Omit<SanityResponseLoader, "config"> = await fetchAPI(url);

  return {
    config,
    ...response,
  };
}
