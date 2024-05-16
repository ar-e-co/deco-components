import { AddToCartParams } from "apps/commerce/types.ts";
import { useState } from "preact/hooks";
import Button from "site/components/ui/Button.tsx";
import { sendEvent } from "site/sdk/analytics.tsx";
import { useUI } from "site/sdk/useUI.ts";
import { AnatomyClasses, handleClasses } from "deco-components/sdk/styles.ts";

const anatomy = [
  "container",
] as const;

type Styles = AnatomyClasses<typeof anatomy[number]>;

export interface Props {
  /** @description: sku name */
  eventParams: AddToCartParams;
  onAddItem: () => Promise<void>; 
  classes?: Styles;
  textCart: string;
}


const useAddToCart = ({ eventParams, onAddItem }: Props) => {
  const [loading, setLoading] = useState(false);
  const { displayCart } = useUI();

  const onClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);

      await onAddItem();

      sendEvent({
        name: "add_to_cart",
        params: eventParams,
      });

      displayCart.value = true;
    } finally {
      setLoading(false);
    }
  };

  return { onClick, loading, "data-deco": "add-to-cart" };
};

export default function AddToCartButton(props: Props) {
  const btnProps = useAddToCart(props);
  const classes = { props }
  

  return (
    <Button {...btnProps} class={handleClasses("btn-primary", classes.props.classes?.container)} >
      {props.textCart || "Adicionar à Sacola"}
    </Button>
  );
}
