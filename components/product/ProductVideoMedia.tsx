export interface Props {
    url:string;
    alt:string;
    index: number
    width: number;
    height:  number;
}

export default function ProductVideoMedia({alt,url,index,height,width}: Props) {
  return (  
    <>
      <video className="w-full h-auto" autoPlay
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
