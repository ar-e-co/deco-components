import { ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import ProductImageZoom from "../../../simples/islands/ProductImageZoom.tsx";
import { useId } from "../../../simples/sdk/useId.ts";
import { usePDP } from "deco-components/sdk/usePDP.ts";
import imgZoom from "deco-components/components/product/ImgZoom.tsx";
import Slider from "../../../simples/components/ui/Slider.tsx";

export interface Props {
    url:string;
    alt:string;
    actionOnClick?: "zoom" | "modal" | "null";
    onMouseOver?: boolean;
    width: number;
    height:  number;
    index: number
}

/**
 * @title Product Image Slider
 * @description Creates a three columned grid on destkop, one for the dots preview, one for the image slider and the other for product info
 * On mobile, there's one single column with 3 rows. Note that the orders are different from desktop to mobile, that's why
 * we rearrange each cell with col-start- directives
 */
export default function ProductItemPDP({alt,url,index,actionOnClick="zoom",onMouseOver=false,height,width}: Props) {
    const aspectRatio = `${width} / ${height}`;

  function addID(id) {
    imgZoom(id);
  }

  return (
    <>
        <Slider.Item
        index={index}
        id={`box${index}`}
        class={`carousel-item w-full max-w-[550px] pr-5 pb-5 h-full max-h-[820px] ${
            actionOnClick == "zoom" && "cursor-zoom-in"
        }`}
        onClick={(e) => (actionOnClick == "zoom" && addID(e.target.id))}
        >
        {/* Tentar fazer uma logica de clique ao clicar na imagem adiciona algo ao id dela e do box podendo fazer com que ambos sejam os unicos a mexer */}
        <div class=" items-center justify-center m-0 lg:min-h-[820px]  overflow-hidden relative ">
            <Image
            class={`bg-base-100 col-span-full row-span-full rounded w-full h-full opacity-100 lg:group-hover:opacity-0`}
            sizes="(max-width: 640px) 100vw, 40vw"
            style={{aspectRatio}}
            src={url}
            alt={alt}
            width={width}
            height={height}
            // Preload LCP image for better web vitals
            preload={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            id={index}
            name={index}
            />
        </div>

        <script
            dangerouslySetInnerHTML={{
            __html: `(${imgZoom.toString()})()`,
            }}
        />
        </Slider.Item>

        {actionOnClick == "modal" &&
        (
            <div class="absolute top-2 right-2 bg-transparent w-full h-full">
            <ProductImageZoom
                images={sliderImages}
                width={700}
                height={Math.trunc(700 * height / width)}
            />
            </div>
        )}
    </>
  );
}
