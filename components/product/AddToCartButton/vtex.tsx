import { useCart } from "apps/vtex/hooks/useCart.ts";
import Button, { Props as BtnProps } from "./AddToCartButton.tsx";
import { AnatomyClasses, handleClasses } from "../../../sdk/styles.ts";


const anatomy = [
  "container",
] as const;
type Styles = AnatomyClasses<typeof anatomy[number]>;

export interface Props extends Omit<BtnProps, "onAddItem"> {
  seller: string;
  productID: string;
  classes?: Styles;
  textCart?:string;
}

function AddToCartButton({ seller, productID, eventParams,classes,textCart }: Props) {
  const { addItems } = useCart();
  function onAddItem() {
    addItems({
      orderItems: [{
        id: productID,
        seller: seller,
        quantity: 1,
      }],
    });
  }

  return <Button classes={classes} textCart={textCart} onAddItem={onAddItem} eventParams={eventParams} />;
}

export default AddToCartButton;
