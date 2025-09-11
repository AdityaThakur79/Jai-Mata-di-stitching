import React from "react";
import { Gallery } from "../Gallery";
import { motion } from "framer-motion";
import CTA from "../CTA";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useGetAllGalleryQuery } from '@/features/api/galleryApi';
import { Loader2 } from 'lucide-react';

const GalleryPage = () => {
  // Fetch all images for the gallery page
  const { data, isLoading, error } = useGetAllGalleryQuery();
  const images = data?.gallery || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 mb-8 sm:mb-12">
      <div className="relative h-[40vh] md:h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Image as Header */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/gallery-banner.png')",
          }}
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
        {/* Breadcrumbs - Centered */}
        <nav
          className="absolute top-16 sm:top-12 md:top-16  left-1/2 -translate-x-1/2 z-20"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm md:text-base">
            <li>
              <a
                href="/"
                className="text-white/80 hover:text-amber-300 transition-colors"
              >
                Home
              </a>
            </li>
            <li className="text-white/60">/</li>
            <li className="text-amber-200 font-semibold">Gallery</li>
          </ol>
        </nav>
        {/* Header Content */}
        <motion.div
          className="relative z-10 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-2 sm:mb-3 md:mb-4 font-serif leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            A Legacy Woven in Every Stitch
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 font-light drop-shadow mt-1 sm:mt-2 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Explore a curated selection of handcrafted elegance — from heritage
            weaves to modern silhouettes. Witness the timeless artistry of JMD
            Tailors.
          </motion.p>
        </motion.div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">Failed to load gallery images.</div>
      ) : images.length === 0 ? (
        <div className="text-center text-gray-500 py-8">No gallery images found.</div>
      ) : (
        <section id="photos" className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
          <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
            <BlurFade direction="up" offset={24}>
              <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 font-serif">CRAFTED VISIONS</h2>
              <h1 className="text-3xl md:text-5xl font-light text-gray-800 mb-4 font-serif leading-tight">Our Gallery</h1>
              <div className="flex justify-center mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-px bg-amber-300"></div>
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <div className="w-8 h-px bg-amber-300"></div>
                </div>
              </div>
            </BlurFade>
          </div>
          <div className="columns-2 gap-4 sm:columns-3">
            {images.map((img, idx) => (
              <BlurFade key={img._id || img.image || idx} delay={0.25 + idx * 0.05} inView>
                <div className="mb-4 group relative overflow-hidden rounded-lg cursor-pointer">
                  {/* Image */}
                  <img
                    className="size-full object-contain transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-110"
                    src={img.galleryImage}
                    alt={img.title || `Gallery image ${idx + 1}`}
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"></div>
                  {/* Golden Border Effect */}
                  <div 
                    className="absolute inset-0 border-2 opacity-0 group-hover:opacity-80 transition-all duration-300 ease-out rounded-lg"
                    style={{ borderColor: '#e3b873' }}
                  ></div>
                  {/* Subtle Glow Effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-500 ease-out rounded-lg blur-sm"
                    style={{ 
                      background: 'radial-gradient(circle at center, #e3b873 0%, transparent 70%)',
                      transform: 'scale(1.1)'
                    }}
                  ></div>
                  {/* Corner Accents */}
                  <div className="absolute top-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-60 transition-all duration-300 delay-100">
                    <div 
                      className="absolute top-0 right-0 w-full h-0.5 transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                      style={{ background: '#e3b873' }}
                    ></div>
                    <div 
                      className="absolute top-0 right-0 h-full w-0.5 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 delay-75"
                      style={{ background: '#e3b873' }}
                    ></div>
                  </div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 opacity-0 group-hover:opacity-60 transition-all duration-300 delay-150">
                    <div 
                      className="absolute bottom-0 left-0 w-full h-0.5 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                      style={{ background: '#e3b873' }}
                    ></div>
                    <div 
                      className="absolute bottom-0 left-0 h-full w-0.5 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 delay-75"
                      style={{ background: '#e3b873' }}
                    ></div>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </section>
      )}
      <CTA />
    </div>
  );
};

export default GalleryPage;
