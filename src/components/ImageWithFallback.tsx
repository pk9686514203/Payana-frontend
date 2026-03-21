import { ImgHTMLAttributes, useEffect, useState } from "react";

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/placeholder.png",
  ...props
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [fallbackSrc, src]);

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      onError={() => setCurrentSrc(fallbackSrc)}
    />
  );
}
