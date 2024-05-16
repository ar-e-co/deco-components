import { sendEvent } from "../../simples/sdk/analytics.tsx";
import { AddToCartParams } from "apps/commerce/types.ts";

export interface Props {
    eventParams: AddToCartParams;
    onAddItem: () => Promise<void>; 
  }

export const useAddToCart = ({ eventParams, onAddItem, }: Props) => {
    const onClick = async (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
  
      try {
  
        await onAddItem();
  
        sendEvent({
          name: "add_to_cart",
          params: eventParams,
        });
  
      } finally {
      }
    };
  
    return { onClick, "data-deco": "add-to-cart" };
  };