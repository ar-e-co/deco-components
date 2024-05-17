import Image from "apps/website/components/Image.tsx";
import ProductImageZoom from "../../../simples/islands/ProductImageZoom.tsx";
import imgZoom from "deco-components/components/product/ImgZoom.tsx";
import Slider from "../../../simples/components/ui/Slider.tsx";

export interface Props {
    url:string;
    alt:string;
    actionOnClick?: "zoom" | "modal";
    onMouseOver?: boolean;
    width: number;
    height:  number;
    index: number
}

export default function ProductMedia({alt,url,index,actionOnClick="zoom",onMouseOver=false,height,width}: Props) {
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
        <div class=" items-center justify-center m-0 lg:min-h-[820px]  overflow-hidden relative ">
            <Image
            class={`bg-base-100 col-span-full row-span-full rounded w-full h-full opacity-100 lg:group-hover:opacity-0`}
            sizes="(max-width: 640px) 100vw, 40vw"
            style={{aspectRatio}}
            src={url}
            alt={alt}
            width={width}
            height={height}
            preload={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            id={index}
            name={index}
            />
        </div>
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
