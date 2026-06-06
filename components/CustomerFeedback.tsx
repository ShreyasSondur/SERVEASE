"use client";

import { useState, useRef, useEffect } from "react";
import { Star } from "lucide-react";

const REVIEWS = [
  {
    id: 1,
    quote:
      "I needed a plumber urgently and found a reliable professional within minutes. The whole process was smooth and super easy!",
    name: "Arjun Mehta",
    title: "Homeowner",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    quote:
      "As a working professional, this platform saved me so much time. I could compare options and connect directly with trusted experts.",
    name: "Pooja Sharma",
    title: "Homeowner",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    quote:
      "Found an excellent carpenter for my home renovation. Great quality work and very professional service. Highly recommended!",
    name: "Rahul Verma",
    title: "Homeowner",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
  },
];

export default function CustomerFeedback() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Track if the section is visible on screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 } // Start playing when 50% of the section is in view
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle manual scroll to update the active dot
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    // Calculate the center of the scroll container
    const containerCenter = scrollPosition + scrollRef.current.clientWidth / 2;
    
    // Find the child closest to the center
    let closestIndex = 0;
    let closestDistance = Infinity;

    Array.from(scrollRef.current.children).forEach((child, index) => {
      const childElement = child as HTMLElement;
      const childCenter = childElement.offsetLeft + childElement.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (activeIndex !== closestIndex) {
      setActiveIndex(closestIndex);
    }
  };

  // Scroll to a specific card when clicking a dot
  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const child = scrollRef.current.children[index] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  // Auto-play looping functionality (only when visible and not interacting)
  useEffect(() => {
    if (!isVisible || isInteracting) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const nextIndex = activeIndex === REVIEWS.length - 1 ? 0 : activeIndex + 1;
      scrollTo(nextIndex);
    }, 4000); // loops every 4 seconds

    return () => clearInterval(interval);
  }, [activeIndex, isVisible, isInteracting]);

  return (
    <section ref={sectionRef} className="w-full bg-black py-16 sm:py-20 lg:py-28">
      {/* Header */}
      <div className="flex flex-col items-center mb-10 sm:mb-14 lg:mb-20 text-center px-4">
        <p className="text-gold font-sans text-[10px] sm:text-xs lg:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4">
          CUSTOMER REVIEWS
        </p>
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-normal leading-snug">
          Here is what our customers have to say
        </h2>
      </div>

      {/* Cards Slider */}
      <div className="w-full mt-8 sm:mt-12 lg:mt-15">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          onPointerDown={() => setIsInteracting(true)}
          onPointerUp={() => setIsInteracting(false)}
          onPointerLeave={() => setIsInteracting(false)}
          className="flex overflow-x-auto snap-x snap-mandatory gap-5 sm:gap-6 lg:gap-8 px-4 sm:px-8 lg:px-12 xl:justify-center w-full pb-8 pt-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="glass-card rounded-2xl flex flex-col px-6 sm:px-8 lg:px-9 py-7 sm:py-8 lg:py-10 w-[85vw] sm:w-[380px] lg:w-[420px] shrink-0 snap-center transition-transform duration-300"
            >
              {/* Quote Icon */}
              <svg
                width="36"
                height="26"
                viewBox="0 0 48 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 mb-5 sm:mb-6 lg:mb-8 w-8 h-6 sm:w-10 sm:h-7 lg:w-11 lg:h-8"
              >
                <path
                  d="M0 36V22.5C0 18.3 0.75 14.55 2.25 11.25C3.8 7.9 5.95 5.1 8.7 2.85C11.5 0.95 14.65 0 18.15 0L19.5 6.75C16.3 7.15 13.75 8.55 11.85 10.95C10 13.3 9.05 16.1 9 19.35H18V36H0ZM27 36V22.5C27 18.3 27.75 14.55 29.25 11.25C30.8 7.9 32.95 5.1 35.7 2.85C38.5 0.95 41.65 0 45.15 0L46.5 6.75C43.3 7.15 40.75 8.55 38.85 10.95C37 13.3 36.05 16.1 36 19.35H45V36H27Z"
                  fill="#C9983F"
                />
              </svg>

              {/* Quote Text */}
              <p className="text-white font-sans font-light text-sm sm:text-[15px] lg:text-base leading-7 sm:leading-8 grow">
                {review.quote}
              </p>

              {/* Divider */}
              <div className="w-full h-px bg-white/7 mt-6 sm:mt-8 mb-5 sm:mb-6 shrink-0" />

              {/* Reviewer Info */}
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full overflow-hidden shrink-0 border-2 border-gold/40">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Name & Title */}
                  <div className="flex flex-col">
                    <span className="text-white font-serif text-sm sm:text-[15px] lg:text-[17px] font-medium leading-snug">
                      {review.name}
                    </span>
                    <span className="font-sans text-[11px] sm:text-[12px] lg:text-[13px] text-gold/70">
                      {review.title}
                    </span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 sm:gap-1 shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-gold fill-gold"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2.5 sm:gap-3 mt-8 sm:mt-12">
        {REVIEWS.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`transition-all duration-300 rounded-full ${
              activeIndex === index
                ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-gold"
                : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/25 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
