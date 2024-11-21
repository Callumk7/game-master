import { Cross1Icon } from "@radix-ui/react-icons";
import { Image } from "@repo/api/dist/types/images";
import { useState } from "react";

interface ImageGridProps {
  images: Image[];
}

export function ImageGrid({ images }: ImageGridProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setExpandedImage(imageUrl);
  };

  const handleCloseExpanded = () => {
    setExpandedImage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="aspect-square cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-105"
            onClick={() => handleImageClick(image.imageUrl)}
          >
            <img
              src={image.imageUrl}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={handleCloseExpanded}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={expandedImage}
              alt="Expanded view"
              className="max-w-full max-h-full object-contain"
            />
            <button
              type="button"
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              onClick={handleCloseExpanded}
            >
              <Cross1Icon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGrid;
