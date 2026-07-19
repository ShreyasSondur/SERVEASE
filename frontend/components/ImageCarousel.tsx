"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

interface ImageCarouselProps {
  images?: string[];
  imageUrl?: string;
  title: string;
  isFeatured?: boolean;
  featuredBadge?: React.ReactNode;
}

export default function ImageCarousel({
  images = [],
  imageUrl,
  title,
  isFeatured = false,
  featuredBadge,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  let parsedImages = [];
  if (Array.isArray(images)) {
    parsedImages = images;
  } else if (typeof images === "string") {
    try {
      parsedImages = JSON.parse(images);
    } catch (e) {
      parsedImages = [images];
    }
  }

  // Combine images and imageUrl into a list of unique, valid URLs
  const rawImages = [
    ...(Array.isArray(parsedImages) ? parsedImages : []),
    ...(imageUrl ? [imageUrl] : []),
  ];
  
  // Deduplicate and filter out empty strings
  const validImages = Array.from(new Set(rawImages)).filter(
    (img) => typeof img === "string" && img.trim() !== ""
  );

  if (validImages.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#222] text-[#555] rounded-2xl">
        <span className="text-sm font-semibold tracking-wider">NO IMAGE</span>
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(index);
  };
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    }
    if (isRightSwipe) {
      setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    }
  };

  return (
    <div 
      className="relative w-full h-full group overflow-hidden rounded-2xl bg-black"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
    >
      {/* Images container */}
      <div className="w-full h-full relative">
        {validImages.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={`${title} - Image ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`absolute inset-0 object-cover transition-opacity duration-500 ease-in-out ${
              index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
      </div>

      {/* Featured Badge Overlay */}
      {isFeatured && !featuredBadge && (
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 bg-white/90 backdrop-blur-sm text-[#c28532] text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-[4px] flex items-center gap-1 uppercase tracking-wider shadow-md">
          <Star className="w-3 h-3 fill-[#c28532]" /> FEATURED
        </div>
      )}
      {featuredBadge && <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20">{featuredBadge}</div>}

      {/* Navigation Arrows */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/55 hover:bg-black/75 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 hover:scale-105 active:scale-95 border border-white/10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 h-5 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/55 hover:bg-black/75 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 hover:scale-105 active:scale-95 border border-white/10"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4 md:w-5 h-5 text-white" />
          </button>
        </>
      )}

      {/* Slide Indicators / Dots */}
      {validImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 bg-black/40 px-2.5 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => handleDotClick(e, index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? "bg-white w-3" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
