import type {
  AnalyticsEvent,
  Offer,
  ProductLeaf,
} from "apps/commerce/types.ts";
import type { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { OrderForm, OrderFormItem } from "apps/vtex/utils/types.ts";
import { getAdditionalProperty } from "deco-components/sdk/product/utils.ts";

export const sendEvent = <E extends AnalyticsEvent>(event: E) => {
  console.log(JSON.stringify(event, null, 2));
  globalThis.window.DECO.events.dispatch(event);
};

export const mapCategoriesToAnalyticsCategories = (
  categories: string[],
): Record<`item_category${number | ""}`, string> => {
  return categories.slice(0, 5).reduce(
    (result, category, index) => {
      result[`item_category${index === 0 ? "" : index + 1}`] = category;
      return result;
    },
    {} as Record<`item_category${number | ""}`, string>,
  );
};

export const mapProductCategoryToAnalyticsCategories = (category: string) => {
  return category.split(">").reduce(
    (result, category, index) => {
      result[`item_category${index === 0 ? "" : index + 1}`] = category.trim();
      return result;
    },
    {} as Record<`item_category${number | ""}`, string>,
  );
};

export type CustomAnalyticsItem = AnalyticsItem & {
  dimension1?: string;
  dimension2?: string;
  dimension3?: string;
  dimension4?: string;
};

export function mapProductToAnalyticsItem({
  product,
  sku,
  quantity = 1,
  price,
  availability,
  ...rest
}: Partial<AnalyticsItem> & {
  product: Product;
  sku: ProductLeaf | null;
  price: number | undefined;
  availability?: Offer["availability"];
  quantity?: number;
}): CustomAnalyticsItem | null | undefined {
  if (!sku) {
    return undefined;
  }

  const categories = mapProductCategoryToAnalyticsCategories(
    product.category ?? "",
  );

  const analyticsItem: CustomAnalyticsItem = {
    dimension1: product.isVariantOf?.model ?? "",
    dimension2:
      getAdditionalProperty("RefId", sku?.additionalProperty)?.value ?? "",
    dimension3: sku?.name,
    ...!!availability && {
      dimension4: availability === "https://schema.org/InStock"
        ? "available"
        : "unavailable",
    },
    item_brand: product.brand?.name ?? "",
    ...categories,
    item_id: product.inProductGroupWithID,
    item_name: product.isVariantOf?.name ?? product.name ?? "",
    item_variant: sku?.productID,
    price,
    quantity,
    ...rest,
  };

  return analyticsItem;
}

export const mapItemCategoriesToAnalyticsCategories = (
  item: OrderFormItem,
): Record<`item_category${number | ""}`, string> => {
  return mapCategoriesToAnalyticsCategories(
    Object.values(item.productCategories),
  );
};

export const itemToAnalyticsItem = (
  item: OrderForm["items"][number] & { coupon?: string },
  index: number,
) => {
  return ({
    affiliation: item.seller,
    item_id: item.id,
    item_group_id: item.productId,
    quantity: item.quantity,
    coupon: item.coupon ?? "",
    price: item.sellingPrice / 100,
    index,
    discount: Number(((item.listPrice - item.sellingPrice) / 100).toFixed(2)),
    item_name: item.name ?? item.skuName ?? "",
    item_variant: item.skuName,
    item_brand: item.additionalInfo.brandName ?? "",
    item_url: new URL(item.detailUrl, globalThis.window.location.href).href,
    ...(mapItemCategoriesToAnalyticsCategories(item)),
    dimension1: item.productRefId,
    dimension2: item.refId,
    dimension3: item.skuName,
    dimension4: item.availability,
  });
};
