import type {
  SanityProjectConfig,
  SanityProjectConfigProp,
} from "deco-components/sdk/sanity/Types.ts";

/** @title Configuração de Projeto Sanity */
export interface Props extends SanityProjectConfigProp {}

export default function loader(props: Props): SanityProjectConfig {
  return props;
}
