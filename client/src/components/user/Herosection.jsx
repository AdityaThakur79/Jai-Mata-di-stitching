import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "/images/banner1.png",
    headline: "Modern Tailoring for the Modern Man",
    text: "Tailor Made London offers high quality bespoke tailoring combining innovative 3D body scanning technology with traditional tailoring craft.",
  },
  {
    image: "/images/banner1.png",
    headline: "Craftsmanship Meets Innovation",
    text: "Experience the perfect blend of traditional Hong Kong tailoring with modern precision and contemporary style.",
  },
  {
    image: "/images/banner1.png",
    headline: "Bespoke Excellence Since 1984",
    text: "Four decades of creating exceptional garments for discerning gentlemen who appreciate quality and attention to detail.",
  },
];

const transition = { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] };

const heroContent = [
  {
    script: "JMD Stitching",
    title: "Premium TAILORS",
    tradition: "TRADITION",
    years: "40 YEARS OF EXCELLENCE",
  },
];

const HeroSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden bg-black min-h-[500px] h-[100dvh] sm:h-screen">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={transition}
        >
          <div className="absolute inset-0 w-full h-full">
            <motion.img
              src={slides[index].image}
              alt="Bespoke Tailoring"
              className="w-full h-full object-cover"
              initial={{ scale: 1 }}
              animate={{ scale: 1.03 }}
              transition={{ duration: 8, ease: "easeInOut" }}
              draggable={false}
            />
          </div>

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/30 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 z-10 pointer-events-none" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-start px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 pt-[12vh] sm:pt-0 z-20">
            <div className="w-full max-w-[90vw] sm:max-w-2xl lg:max-w-3xl">
              {heroContent.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                  className="text-left select-none"
                >
                  {/* Script Title */}
                  <div className="mb-1 sm:mb-2">
                    <span
                      className="block text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
                      style={{
                        color: "#d4af37",
                        fontFamily: "Playfair Display, serif",
                        fontWeight: 400,
                        textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                        lineHeight: 1,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {item.script}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="mb-4 sm:mb-6">
                    <h1
                      className="text-sm sm:text-lg md:text-xl lg:text-2xl"
                      style={{
                        color: "#ffffff",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 300,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        lineHeight: 1.2,
                        textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
                      }}
                    >
                      {item.title}
                    </h1>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center justify-start mb-2 sm:mb-3">
                    <div className="h-px bg-gradient-to-r from-white/40 to-transparent w-8 sm:w-12 md:w-16 lg:w-24"></div>
                    <div className="mx-2 sm:mx-3 md:mx-4">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-[#d4af37] sm:w-5 sm:h-5"
                      >
                        <circle cx="10" cy="10" r="2" fill="currentColor" />
                        <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="0.5" />
                      </svg>
                    </div>
                    <div className="h-px bg-gradient-to-r from-white/40 to-transparent w-8 sm:w-12 md:w-16 lg:w-24"></div>
                  </div>

                  {/* Tradition */}
                  <div className="mb-3 sm:mb-4">
                    <span
                      className="text-xs sm:text-sm md:text-base"
                      style={{
                        color: "#d4af37",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                      }}
                    >
                      {item.tradition}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="mb-6 sm:mb-8 md:mb-10">
                    <p
                      className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
                      style={{
                        color: "#f5f5f5",
                        fontFamily: "Lato, sans-serif",
                        lineHeight: 1.5,
                        letterSpacing: "0.02em",
                        fontWeight: 300,
                        textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
                      }}
                    >
                      {slides[index].text}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="flex justify-start">
                    <button
                      type="button"
                      style={{
                        background: "linear-gradient(90deg, #f5e6c6 0%, #e3b873 100%)",
                        color: "#1a1a1a",
                        border: "2px solid #e3b873",
                        borderRadius: "2px",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        fontFamily: "Montserrat, sans-serif",
                        textTransform: "uppercase",
                        boxShadow: "0 4px 20px rgba(227, 184, 115, 0.2)",
                        transition: "all 0.3s ease",
                        position: "relative",
                        overflow: "hidden",
                      }}
                      className="group px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-xs sm:text-sm md:text-base hover:bg-transparent hover:text-[#e3b873] focus:outline-none focus:ring-2 focus:ring-[#e3b873] focus:ring-offset-2 focus:ring-offset-black"
                      onMouseEnter={(e) => {
                        e.target.style.background = "transparent";
                        e.target.style.color = "#e3b873";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "linear-gradient(90deg, #f5e6c6 0%, #e3b873 100%)";
                        e.target.style.color = "#1a1a1a";
                      }}
                    >
                      <span className="hidden sm:inline">{item.years}</span>
                      <span className="sm:hidden">Book Now</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider Dots */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-500 ${
              i === index ? "bg-[#d4af37] scale-150 shadow-lg shadow-[#d4af37]/50" : "bg-white/50 hover:bg-white/80"
            }`}
            style={{
              border: i === index ? "1px solid #d4af37" : "1px solid rgba(255,255,255,0.3)",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-4 h-6 sm:w-6 sm:h-10 border-2 border-white/40 rounded-full flex justify-center"
        >
          <div className="w-0.5 h-2 sm:w-1 sm:h-3 bg-white/60 rounded-full mt-1 sm:mt-2"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
