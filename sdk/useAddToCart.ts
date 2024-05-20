import { useState } from "preact/hooks";
import { AddToCartParams } from "apps/commerce/types.ts";
import { sendEvent } from "./analytics.tsx";

export interface Props {
  eventParams: AddToCartParams;
  onAddItem: () => Promise<void>;
}

export const useAddToCart = ({ eventParams, onAddItem, }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addItems = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      await onAddItem();

      sendEvent({
        name: "add_to_cart",
        params: eventParams,
      });

    }
    catch(err) {
      setError(err);
    }
    finally {
      setLoading(false);
    }
  };

  return { 
    addItems, 
    loading,
    error,
    "data-deco": "add-to-cart", 
  };
};