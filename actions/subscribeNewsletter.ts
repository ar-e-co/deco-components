import type { AppContext } from "deco-components/mod.ts";
import { ClientOf } from "apps/utils/http.ts";
import { OpenAPI as VCS } from "apps/vtex/utils/openapi/vcs.openapi.gen.ts";

export interface Props {
  email: string;
}

// Extends the VCS client with the endpoint to subscribe the newsletter
type Client = ClientOf<
  VCS & {
    // Update the personal preferences of a profile, or create a new profile if it doesn't exist
    "POST /api/profile-system/pvt/profiles/:userId/personalPreferences": {
      body: {
        isNewsletterOptIn: boolean;
      };
      response: {
        profileId: string;
      };
    };
  }
>;

async function subscribeNewsletter(
  props: Props,
  _req: Request,
  ctx: AppContext,
) {
  const { vcs } = await ctx.invoke.vtex.loaders.config() as unknown as {
    vcs: Client;
  };

  return vcs
    ["POST /api/profile-system/pvt/profiles/:userId/personalPreferences"](
      { userId: encodeURIComponent(props.email) },
      { body: { isNewsletterOptIn: true } },
    );
}

export default subscribeNewsletter;
