import { useCart } from "apps/vtex/hooks/useCart.ts";
import { useEffect } from "preact/hooks";

export interface Props {
  /** @title Parâmetro da URL para se aplicar um cupom automático */
  couponUrlParam?: string;
}

/** @description Import as an island */
export default function Initializers({
  couponUrlParam,
}: Props) {
  const cart = useCart();
  const { addCouponsToCart } = cart;

  useEffect(() => {
    async function addCoupon() {
      if (!couponUrlParam) return;

      const searchParams = new URLSearchParams(window.location.search);
      const coupon = searchParams.get(couponUrlParam);

      if (!coupon) return;

      await addCouponsToCart({ text: coupon });
    }

    addCoupon();
  }, []);

  return <></>;
}
