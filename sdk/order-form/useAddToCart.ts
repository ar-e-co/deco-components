import { useState } from "preact/hooks";
import { AddToCartParams } from "apps/commerce/types.ts";
import { sendEvent } from "../analytics.tsx";

export interface Props {
  eventParams: AddToCartParams;
  onAddItem: () => Promise<void> | void;
}

export function useAddToCart({ eventParams, onAddItem }: Props) {
  const [isLoading, setLoading] = useState(false);

  async function onClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      await onAddItem();

      sendEvent({
        name: "add_to_cart",
        params: eventParams,
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    onClick,
    isLoading,
    "data-deco": "add-to-cart",
  };
}
