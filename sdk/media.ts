import type { ImageWidget, VideoWidget } from "apps/admin/widgets.ts";

/**
 * @title Imagem
 */
export interface ImageMediaProps {
  /**
   * @title Selecione uma imagem
   * @description Selecione do banco de imagens ou faça upload de uma nova
   */
  image: ImageWidget;
}

export interface ResponsiveImageMediaProps {
  /**
   * @title Imagem Mobile
   */
  mobile: ImageMediaProps;
  /**
   * @title Imagem Desktop
   */
  desktop: ImageMediaProps;
}

/**
 * @title Vídeo
 */
export interface VideoMediaProps {
  /**
   * @title Vídeo
   * @description Selecione do banco de vídeos ou faça upload de um novo
   */
  video: VideoWidget;
  /**
   * @title Poster do vídeo
   */
  poster: ImageWidget;
}

export interface ResponsiveVideoMediaProps {
  /**
   * @title Vídeo Mobile
   */
  mobile: VideoMediaProps;
  /**
   * @title Vídeo Desktop
   */
  desktop: VideoMediaProps;
}

export type Media = ImageMediaProps | VideoMediaProps;

export interface MediaProps {
  /**
   * @title Escolha o tipo de midia
   * @description Faça upload de uma imagem ou vídeo ou escolha da galeria
   */
  media: Media;
  /**
   * @title Descrição da mídia
   */
  alt: string;
}

export interface ResponsiveMediaProps {
  /**
   * @title Tipo de mídia
   * @description Faça upload de uma imagem ou vídeo ou escolha da galeria
   */
  responsiveMedia: ResponsiveImageMediaProps | ResponsiveVideoMediaProps;
  /**
   * @title Descrição da mídia
   */
  alt: string;
}

export function isVideoMedia(
  media: VideoMediaProps | ImageMediaProps,
): media is VideoMediaProps {
  return media && ("video" in media);
}
