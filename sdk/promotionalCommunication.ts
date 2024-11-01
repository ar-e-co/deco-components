import { ResponsiveMediaProps } from "deco-components/sdk/media.ts";
import { RichText } from "apps/admin/widgets.ts";

/** @title CTA - Link */
export interface PromotionalBannerCTALink {
  /** @hide true */
  type: "link";
  /** @title Texto do botão */
  label?: string;
  /** @title Link */
  href?: string;
}

/** @title PromotionalBanner CTA - Cupom */
export interface PromotionalBannerCTACoupon {
  /** @hide true */
  type: "coupon";
  /** @title Texto do botão */
  label?: string;
  /** @title Código do cupom */
  coupon?: string;
}

/** @title {{cta.label}} */
export interface PromotionalBannerActionsType {
  /** @title Tipo do CTA */
  cta: PromotionalBannerCTACoupon | PromotionalBannerCTALink;
}

/** @titleBy _title */
export interface PromotionalBanner extends ResponsiveMediaProps {
  /**
   * @title Título (opcional)
   * @description Usado apenas no CMS
   */
  _title?: string;
  /**
   * @title Tagline
   * @description Texto de destaque, cima do título
   */
  tagline?: string;
  /** @title Título */
  title?: RichText;
  /** @title Conteúdo */
  body?: RichText;
  /**
   * @title Texto jurídico
   * @description Texto curto que aparece no rodapé sobre as condições da promoção
   */
  legalText?: RichText;
  /**
   * @maxItems 3
   */
  ctas?: PromotionalBannerActionsType[];
}
