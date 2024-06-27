import type { ImageWidget, VideoWidget } from "apps/admin/widgets.ts";

/**
 * @title Imagem
 */
export interface ImageProps {
  /**
   * @title Selecione uma imagem
   * @description Selecione do banco de imagens ou faça upload de uma nova
   */
  image: ImageWidget;
}

/**
 * @title Vídeo
 */
export interface VideoProps {
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

export interface MediaProps {
  /**
   * @title Mídia Desktop
   * @description Selecione o tipo de mídia
   */
  mediaDesktop: ImageProps | VideoProps;
  /**
   * @title Mídia mobile
   * @description Selecione o tipo de mídia
   */
  mediaMobile: ImageProps | VideoProps;
  /**
   * @title Descrição da mídia
   */
  alt: string;
}

export function isVideoMedia(
  media: VideoProps | ImageProps,
): media is VideoProps {
  return media && ("video" in media);
}
