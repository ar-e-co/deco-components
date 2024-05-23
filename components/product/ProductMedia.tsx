import Image from "apps/website/components/Image.tsx";
import ProductImageZoom from "../../../simples/islands/ProductImageZoom.tsx";
import imgZoom from "deco-components/components/product/ImgZoom.tsx";
import ProductVideoMedia from "./ProductVideoMedia.tsx";
import { AnatomyClasses, handleClasses } from "../../sdk/styles.ts";


const anatomy = [
  "container",
  "image",
  "video"
] as const;

type StylesImage = AnatomyClasses<typeof anatomy[number]>;


export type StylesImageProps = {
  classes?: StylesImage;
  url:string;
  alt:string;
  actionOnClick?: "zoom" | "modal";
  onMouseOver?: boolean;
  width: number;
  height:  number;
  index: number
};



export default function ProductMedia({alt,url,index,actionOnClick="zoom",onMouseOver=false,height,width,classes}: StylesImageProps) {
    const aspectRatio = `${width} / ${height}`;

  function addID(id) {
    imgZoom(id);
  }

  return (
    <>
      <div
      index={index}
      id={`box${index}`}
      class={handleClasses(classes?.container) + `${actionOnClick == "zoom" && "cursor-zoom-in"} `}
      onClick={(e) => (actionOnClick == "zoom" && addID(e.target.id))}
      >
        {(() => {
        const extension = url.split('.').pop();
        if (extension === 'mp4' || extension === 'mp3') {
          return (
            <ProductVideoMedia 
                alt={alt}
                width={width}
                height={height}
                index={index}                  
                url={url}
                classes={{video: classes?.video}}
                />
          );
        } else {
          return ( 
         <Image
            class={handleClasses(classes?.image)}
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
         
            );
        }
      })()}

          
      </div>

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
