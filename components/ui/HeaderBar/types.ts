import { MediaProps } from "deco-components/sdk/media.ts";
import { RichText } from "apps/admin/widgets.ts";

/** @title CTA - Link */
export interface ModalCTALink {
  /** @hide true */
  type: "link";
  /** @title Texto do botão */
  label?: string;
  /** @title Link */
  href?: string;
}

/** @title Modal CTA - Cupom */
export interface ModalCTACoupon {
  /** @hide true */
  type: "coupon";
  /** @title Texto do botão */
  label?: string;
  /** @title Código do cupom */
  coupon?: string;
}

/** @title {{cta.label}} */
export interface ModalActionsType {
  /** @title Tipo do CTA */
  cta: ModalCTACoupon | ModalCTALink;
}

/** @title Modal */
export interface HeaderBarModal extends Partial<MediaProps> {
  /** @hide true */
  type: "modal";
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
  ctas?: ModalActionsType[];
}

/** @title Link CTA */
export interface HeaderBarCTALink {
  /** @title Link */
  href?: string;
  /** @title Texto */
  text: string;
}

/** @title Modal CTA */
export interface HeaderBarCTAModal {
  /** @title Texto */
  label: string;
  /** @title Configurações */
  modal: HeaderBarModal;
}

/** @title {{__title}} */
export interface Slide {
  /**
   * @title Título
   * @description Usado apenas no CMS
   */
  __title?: string;
  /** @title Texto */
  text: RichText;
  /**
   * @title Cor de fundo
   * @format color-input
   */
  backgroundColor: string;
  /**
   * @title Cor do conteúdo (texto)
   * @description Usar cores que contrastem bem com a cor de fundo
   * @format color-input
   */
  foregroundColor: string;
  /** @title Cluster de usuários */
  cluster?: string;
  /** @maxItems 2 */
  ctas?: Array<HeaderBarCTAModal | HeaderBarCTALink>;
}
