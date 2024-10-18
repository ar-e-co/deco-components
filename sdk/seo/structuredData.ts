import { Product } from "apps/commerce/types.ts";

export function formatListItem(
  item: Record<string, unknown>,
  position: number,
) {
  return {
    "@type": "ListItem" as const,
    position,
    item: {
      "@context": "http://schema.org",
      ...item,
    },
  };
}

// Default object is way too big to be sent to the client
export function formatPLPProduct(product: Product) {
  return {
    "@type": "Product" as const,
    "@id": product.url,
    name: product.name,
    description: product.description,
    image: product.image?.[0]?.url,
    category: product.category,
    sku: product.sku,
    productID: product.productID,
    url: product.url,
    gtin: product.gtin,
    brand: {
      "@type": "Brand" as const,
      name: product.brand?.name,
    },
    offers: {
      "@type": "AggregateOffer" as const,
      priceCurrency: product.offers?.priceCurrency,
      highPrice: product.offers?.highPrice,
      lowPrice: product.offers?.lowPrice,
      offerCount: product.offers?.offerCount,
      offers: product.offers?.offers.map((offer) => ({
        "@type": "Offer" as const,
        priceCurrency: product.offers?.priceCurrency,
        sku: product.sku,
        seller: {
          "@type": "Organization" as const,
          name: offer.sellerName,
        },
        price: offer.price,
        availability: offer.availability,
        priceValidUntil: offer.priceValidUntil,
      })),
    },
  };
}
