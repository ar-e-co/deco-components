import { AnatomyClasses, handleClasses } from "../../sdk/styles.ts";

const anatomy = [
  "video"
] as const;

type StylesVideo = AnatomyClasses<typeof anatomy[number]>;


export type StylesVideoProps = {
  classes?: StylesVideo;
  url:string;
  alt:string;
  index: number
  width: number;
  height:  number;
};

export default function ProductVideoMedia({alt,url,index,height,width,classes}: StylesVideoProps) {
  return (  
    <>
      <video 
        class={handleClasses(classes?.video)}
        autoPlay
        alt={alt}
        width={width}
        height={height}
        preload={index === 0}
        loading={index === 0 ? "eager" : "lazy"}
        id={index}
        name={index}                  
        webkit-playsinline
        muted
        loop
        x5-playsinline
        playsInline
        src={url}>
      </video>
    </>
  );
}
