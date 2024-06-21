import { MediaProps } from "deco-components/sdk/media.ts";
import { HTMLWidget } from "apps/admin/widgets.ts";

/** @title CTA - Link */
export interface ModalCTALink {
  /** @hide */
  type: "link";
  /** @title Texto do botão */
  label?: string;
  /** @title Link */
  href?: string;
}

/** @title Modal CTA - Cupom */
export interface ModalCTACoupon {
  /** @hide */
  type: "coupon";
  /** @title Texto do botão */
  label?: string;
  /** @title Código do cupom */
  coupon?: string;
}

/** @title CTA */
export interface ModalActionsType {
  /** @title Tipo do CTA */
  cta?: ModalCTACoupon | ModalCTALink;
}

/** @title Modal */
export interface HeaderBarModal extends Partial<MediaProps> {
  /** @hide */
  type: "modal";
  /**
   * @title Tagline
   * @description Texto de destaque, cima do título
   */
  tagline?: string;
  /** @title Título */
  title?: HTMLWidget;
  /** @title Conteúdo */
  body?: HTMLWidget;
  /**
   * @title Texto jurídico
   * @description Texto curto que aparece no rodapé sobre as condições da promoção
   */
  legalText?: HTMLWidget;
  /**

   * @maximum 3
   */
  ctas?: ModalActionsType[];
}

/** @title Link CTA */
export interface HeaderBarCTALink {
  /** @title Texto */
  label: string;
  /** @title Link */
  href?: string;
}

/** @title Modal CTA */
export interface HeaderBarCTAModal {
  /** @title Texto */
  label: string;
  /** @title Configurações */
  modal?: HeaderBarModal;
}

/** @title {{__title}} */
export interface Slide {
  /**
   * @title Título
   * @description Usado apenas no CMS
   */
  __title?: string;
  /** @title Texto */
  text: HTMLWidget;
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
  /** @maximum 2 */
  ctas?: Array<HeaderBarCTALink | HeaderBarCTAModal>;
}

/** @title Header Bar */
export interface HeaderBarProps {
  /**
   * @title Intervalo entre slides (ms)
   * @default 7000
   */
  interval: number;
  slides: Slide[];
}
