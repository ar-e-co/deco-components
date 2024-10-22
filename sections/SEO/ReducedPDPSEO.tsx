import { ProductDetailsPage } from "apps/commerce/types.ts";
import { Section, SectionProps } from "deco/blocks/section.ts";
import { formatProduct } from "deco-components/sdk/seo/structuredData.ts";
import { renderSection } from "apps/website/pages/Page.tsx";

export interface Props {
  pdpLoader: ProductDetailsPage | null;
  section: Section;
}

export function loader({
  pdpLoader,
  section: sectionWithoutLoader,
}: Props) {
  // Inject LD+JSON to SeoSection Props
  // This is a reduced version of the SEO section, with only the necessary props
  const seoSection = sectionWithoutLoader && pdpLoader
    ? Object.assign(sectionWithoutLoader, {
      props: {
        ...sectionWithoutLoader.props,
        ...pdpLoader.seo,
        jsonLDs: [{
          ...pdpLoader,
          product: formatProduct(pdpLoader.product),
        }],
      },
    })
    : sectionWithoutLoader;

  return {
    seoSection,
  };
}

export default function ReducedPDPSEO(
  { seoSection }: SectionProps<typeof loader>,
) {
  return <>{renderSection(seoSection)}</>;
}
