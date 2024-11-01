import { ImageWidget, RichText } from "apps/admin/widgets.ts";

/**
 * @title Benefício
 * @description Benefício de um produto, seção ou loja.
 */
export interface Benefit {
  /**
   * @title Imagem
   */
  image: ImageWidget;
  /**
   * @title Texto
   */
  label: RichText;
}
