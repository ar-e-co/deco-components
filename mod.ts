import commerce from "apps/commerce/mod.ts";
import type { App as A, AppContext as AC } from "deco/mod.ts";
import type { Secret } from "apps/website/loaders/secret.ts";
import { InvocationProxy } from "deco/utils/invoke.types.ts";
import type { Manifest as ManifestVTEX } from "apps/vtex/manifest.gen.ts";

import manifest, { Manifest } from "./manifest.gen.ts";
import { InvocationFunc } from "deco/clients/withManifest.ts";

export interface ConfigVerifiedReviews {
  idWebsite: string;
  secretKey?: Secret;
  plateforme?: string;
}

export interface Props {
  account: string;
  configVerifiedReviews: ConfigVerifiedReviews;
}

/**
 * @title AR&Co Components
 * @description Configs to be used by AR&Co Components
 * @category arco
 */
export default function MyApp(state: Props): A<
  Manifest,
  Props,
  [ReturnType<typeof commerce>]
> {
  return { state, manifest };
}

type InvocationManifest = Manifest & ManifestVTEX;

export type AppContext = AC<ReturnType<typeof MyApp>> & {
  invoke:
    & InvocationProxy<InvocationManifest>
    & InvocationFunc<InvocationManifest>;
};
