import type { AnalyticsEvent } from "apps/commerce/types.ts";
import type {
  AnalyticsItem,
  BreadcrumbList,
  Product,
} from "apps/commerce/types.ts";
import { OrderForm, OrderFormItem } from "apps/vtex/utils/types.ts";

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

export const mapProductToAnalyticsItem = (
  {
    product,
    breadcrumbList,
    index = 0,
    quantity = 1,
    coupon = "",
    availability = "",
    price = 0,
    listPrice = 0
  }: {
    product: Product;
    breadcrumbList?: BreadcrumbList;
    index?: number;
    quantity?: number;
    coupon?: string;
    availability?: string;
    price?: number;
    listPrice?: number;
  },
): CustomAnalyticsItem => {
  const {
    name,
    productID,
    inProductGroupWithID,
    isVariantOf,
    url,
    additionalProperty,
  } = product;
  const { model: productRefId } = isVariantOf ?? {};

  const categories = breadcrumbList?.itemListElement
    ? mapCategoriesToAnalyticsCategories(
      breadcrumbList?.itemListElement.map(({ name: _name }) => _name ?? "")
        .filter(Boolean) ??
        [],
    )
    : mapProductCategoryToAnalyticsCategories(product.category ?? "");

  const skuRefId =
    additionalProperty?.find((property) => property.name === "RefId")?.value ||
    "";

  const analyticsItem = {
    item_id: productID,
    item_group_id: inProductGroupWithID,
    quantity,
    coupon,
    price,
    index,
    discount: Number((price && listPrice ? listPrice - price : 0).toFixed(2)),
    item_name: isVariantOf?.name ?? name ?? "",
    item_variant: name,
    item_brand: product.brand?.name ?? "",
    item_url: url,
    ...categories,
    dimension1: productRefId,
    dimension2: skuRefId,
    dimension3: name,
    dimension4: availability === "https://schema.org/InStock"
      ? "available"
      : "unavailable",
  };

  return analyticsItem;
};

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
  return({
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
    dimension4: item.availability
  });
}