import { cn } from "callum-util";
import { useState, useEffect } from "react";

interface CoverImageProps {
  src: string;
  alt?: string;
  ratio?: "square" | "4/3" | "16/9";
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function CoverImage({
  src,
  alt = "Cover image",
  ratio = "16/9",
  className,
  priority = false,
  onLoad,
  onError,
}: CoverImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectRatios = {
    square: "100%",
    "4/3": "75%",
    "16/9": "56.25%",
  };

  useEffect(() => {
    const image = new Image();
    image.src = src;

    if (image.complete) {
      setIsLoading(false);
      onLoad?.();
    }

    return () => {
      image.onload = null;
      image.onerror = null;
    };
  }, [src, onLoad]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  return (
    <div
      className={cn("relative overflow-hidden bg-gray-100 rounded-md border", className)}
      style={{
        paddingBottom: aspectRatios[ratio],
      }}
    >
      {!hasError ? (
        <picture>
          <source srcSet={src.replace(/\.(jpg|png)$/, ".webp")} type="image/webp" />
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100",
            )}
            onLoad={handleLoad}
            onError={handleError}
          />
        </picture>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-sm text-gray-500">Failed to load image</span>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        </div>
      )}
    </div>
  );
}
