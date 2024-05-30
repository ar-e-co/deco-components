import type { App as A, AppContext as AC } from "deco/mod.ts";
import type { Secret } from "apps/website/loaders/secret.ts";
import manifest, { Manifest } from "./manifest.gen.ts";

export interface ConfigVerifiedReviews {
  idWebsite: string;
  secretKey?: Secret;
  plateforme?: string;
}

export interface Props {
  configVerifiedReviews: ConfigVerifiedReviews;
}

/**
 * @title AR&Co Components
 * @description Configs to be used by AR&Co Components
 * @category arco
 */
export default function MyApp(state: Props): A<
  Manifest,
  Props
> {
  return { state, manifest };
}

export type AppContext = AC<ReturnType<typeof MyApp>>;
