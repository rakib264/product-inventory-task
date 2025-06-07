"use client";

import Image from 'next/image';
import { useState } from 'react';

interface ProductImagesProps {
  images: string[];
  title: string;
}

export default function ProductImages({ images, title }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
        {images && images.length > 0 ? (
          <Image
            src={selectedImage}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">No Image Available</span>
          </div>
        )}
      </div>
      
      {images && images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`relative aspect-square rounded-md overflow-hidden bg-gray-100 transition-all ${
                selectedImage === image ? 'ring-2 ring-primary' : 'hover:opacity-80'
              }`}
            >
              <Image
                src={image}
                alt={`${title} ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 120px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 