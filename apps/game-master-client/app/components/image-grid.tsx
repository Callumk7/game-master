import { Cross1Icon } from "@radix-ui/react-icons";
import type { Image } from "@repo/api/dist/types/images";
import { useEffect, useRef, useState } from "react";

interface ImageGridProps {
  images: Image[];
}

export function ImageGrid({ images }: ImageGridProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleImageClick = (imageUrl: string) => {
    setExpandedImage(imageUrl);
  };

  const handleCloseExpanded = () => {
    setExpandedImage(null);
  };

  useEffect(() => {
    if (expandedImage && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current) {
      dialogRef.current.close();
    }
  }, [expandedImage]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            type="button"
            key={image.id}
            className="aspect-square cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-105 p-0 border-0"
            onClick={() => handleImageClick(image.imageUrl)}
            aria-label={`View enlarged image ${index + 1}`}
          >
            <img
              src={image.imageUrl}
              alt={`${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Expanded Image Modal */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <dialog
        ref={dialogRef}
        className="backdrop:bg-black/80 bg-transparent p-4 fixed max-h-[80vh] max-w-[80vw] mx-auto my-auto overflow-hidden"
        onClose={handleCloseExpanded}
        onClick={handleCloseExpanded}
      >
        <div className="relative flex items-center justify-center h-full w-full">
          <img
            src={expandedImage || ""}
            alt="Expanded view"
            className="max-h-[calc(80vh-2rem)] max-w-[calc(80vw-2rem)] object-contain"
          />
          <button
            type="button"
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close expanded image"
          >
            <Cross1Icon />
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default ImageGrid;
