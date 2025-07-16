import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const slides = [
  {
    image: "/images/banner-2.png",
    headline: "Modern Tailoring for the Modern Man",
    text: "Tailor Made London offers high quality bespoke tailoring combining innovative 3D body scanning technology with traditional tailoring craft.",
    hero: {
      script: "JMD Stitching",
      title: "Premium TAILORS",
      tradition: "MODERN CRAFTSMANSHIP",
      years: "INNOVATION MEETS TRADITION",
    }
  },
  {
    image: "/images/banner-1.png",
    headline: "Craftsmanship Meets Innovation",
    text: "Experience the perfect blend of traditional Hong Kong tailoring with modern precision and contemporary style.",
    hero: {
      script: "Bespoke Excellence",
      title: "MASTER CRAFTSMEN",
      tradition: "TIMELESS ELEGANCE",
      years: "PRECISION & ARTISTRY",
    }
  },
  {
    image: "/images/banner-1.png",
    headline: "Bespoke Excellence Since 1984",
    text: "Four decades of creating exceptional garments for discerning gentlemen who appreciate quality and attention to detail.",
    hero: {
      script: "Heritage Tailoring",
      title: "LEGACY OF EXCELLENCE",
      tradition: "FOUR DECADES STRONG",
      years: "SINCE 1984",
    }
  },
];

const transition = { duration: 1.6, ease: [0.23, 1, 0.32, 1] };

const HeroSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black min-h-[500px] h-screen mt-[84px]">
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
              transition={{ duration: 4, ease: "easeInOut" }}
              draggable={false}
            />
          </div>

          {/* Enhanced Overlays for Better Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-black/20 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-transparent to-black/5\20 z-10 pointer-events-none" />

          {/* Subtle Texture Overlay */}
          <div className="absolute inset-0 opacity-20 z-10 pointer-events-none" style={{
            backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%)`,
            backgroundSize: '200px 200px'
          }} />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-start px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 z-20">
            <div className="w-full max-w-[90vw] sm:max-w-2xl lg:max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ delay: 0.3, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                className="text-left select-none"
              >
                {/* Script Title - More refined animation */}
                <div className="mb-1 sm:mb-2 overflow-hidden">
                  <motion.span
                    className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                    style={{
                      background: "linear-gradient(135deg, #fef3c7 0%, #f59e0b 25%, #d97706 50%, #f59e0b 75%, #fef3c7 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontWeight: 400,
                      fontStyle: "italic",
                      lineHeight: 1.1,
                      letterSpacing: "-0.01em",
                      textShadow: "0 0 20px rgba(245, 158, 11, 0.2)",
                    }}
                    initial={{ opacity: 0, y: 60, rotateX: 90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: 0.6, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {slides[index].hero.script}
                  </motion.span>
                </div>

                {/* Title - Cleaner typography */}
                <div className="mb-4 sm:mb-6 overflow-hidden">
                  <motion.h1
                    className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl"
                    style={{
                      color: "#f8fafc",
                      fontFamily: "'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      fontWeight: 300,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      lineHeight: 1.4,
                      textShadow: "0 2px 15px rgba(0,0,0,0.7)",
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {slides[index].hero.title}
                  </motion.h1>
                </div>

                {/* Refined Divider */}
                <motion.div 
                  className="flex items-center justify-start mb-4 sm:mb-6"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 1.1, duration: 1, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="h-0.5 bg-gradient-to-r from-amber-300/70 via-amber-400/90 to-amber-300/70 w-16 sm:w-20 md:w-24 lg:w-32"></div>
                  <div className="mx-4 sm:mx-6 md:mx-8">
                    <div className="relative">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full"></div>
                      <div className="absolute inset-0 bg-amber-400/40 rounded-full blur-sm animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-amber-300/70 via-amber-400/90 to-amber-300/70 w-16 sm:w-20 md:w-24 lg:w-32"></div>
                </motion.div>

                {/* Tradition - Enhanced styling */}
                <div className="mb-6 sm:mb-8 overflow-hidden">
                  <motion.span
                    className="text-sm sm:text-base md:text-lg lg:text-xl"
                    style={{
                      color: "#fbbf24",
                      fontFamily: "'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      fontWeight: 500,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      textShadow: "0 2px 10px rgba(251, 191, 36, 0.5)",
                    }}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {slides[index].hero.tradition}
                  </motion.span>
                </div>

                {/* Description - Better readability */}
                <div className="mb-8 sm:mb-10 md:mb-12 overflow-hidden">
                  <motion.p
                    className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl"
                    style={{
                      color: "#e2e8f0",
                      fontFamily: "'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      lineHeight: 1.7,
                      letterSpacing: "0.01em",
                      fontWeight: 400,
                      textShadow: "0 1px 8px rgba(0,0,0,0.8)",
                    }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {slides[index].text}
                  </motion.p>
                </div>

                {/* Enhanced CTA Button */}
                <motion.div 
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                >
                  {/* <button
                    type="button"
                    className="group relative px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 text-sm sm:text-base md:text-lg font-medium tracking-wide uppercase overflow-hidden transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
                    style={{
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      color: "#0f172a",
                      borderRadius: "2px",
                      fontFamily: "'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      fontWeight: 600,
                      boxShadow: "0 10px 40px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                      transform: "translateZ(0)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)";
                      e.target.style.transform = "translateY(-3px) translateZ(0)";
                      e.target.style.boxShadow = "0 15px 50px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
                      e.target.style.transform = "translateY(0) translateZ(0)";
                      e.target.style.boxShadow = "0 10px 40px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
                    }}
                  >
                    <span className="relative z-10">
                      <span className="hidden sm:inline">{slides[index].hero.years}</span>
                      <span className="sm:hidden">Explore Collection</span>
                    </span>
                  </button> */}

                   <Link to="/fabrics">
            <button
              className="border-2 px-4 sm:px-8 py-1.5 sm:py-2 text-base sm:text-lg font-serif tracking-wider shadow-md transition-all duration-300 uppercase"
              style={{ borderRadius: 0, background: '#e3b873', color: '#222', borderColor: '#e3b873' }}
              onMouseOver={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#e3b873'; e.currentTarget.style.borderColor = '#222'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#e3b873'; e.currentTarget.style.color = '#222'; e.currentTarget.style.borderColor = '#e3b873'; }}
            >
             Explore Now
            </button>
          </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Slider Dots */}
      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-4 sm:gap-6 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`relative w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-700 ${
              i === index ? "scale-125" : "hover:scale-110"
            }`}
            style={{
              background: i === index 
                ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                : "rgba(255, 255, 255, 0.4)",
              boxShadow: i === index 
                ? "0 0 20px rgba(245, 158, 11, 0.6), 0 0 40px rgba(245, 158, 11, 0.3)"
                : "0 0 10px rgba(255, 255, 255, 0.2)",
            }}
            aria-label={`Go to slide ${i + 1}`}
          >
            {i === index && (
              <div className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping"></div>
            )}
          </button>
        ))}
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 sm:w-6 sm:h-12 border-2 border-white/40 rounded-full flex justify-center relative"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
          }}
        >
          <motion.div 
            className="w-1 h-3 sm:w-1.5 sm:h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full mt-2 sm:mt-3"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* Refined Ambient Light Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-5">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-amber-400/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-yellow-500/3 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default HeroSection;