import type { Manifest } from "./manifest.gen.ts";
import type { Manifest as ManifestVTEX } from "apps/vtex/manifest.gen.ts";
import { proxy } from "@deco/deco/web";
export const invoke = proxy<Manifest & ManifestVTEX>();
