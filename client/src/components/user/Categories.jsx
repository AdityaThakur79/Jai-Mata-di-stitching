import React, { useState, useRef, useEffect } from 'react';
import { X, Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { useGetAllCategoriesQuery } from '@/features/api/categoriesApi';

// Intersection Observer Hook
const useIntersectionObserver = (options = {}) => {
  const [entries, setEntries] = useState([]);
  const [observer, setObserver] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      setEntries(entries);
    }, {
      threshold: 0.2,
      rootMargin: '50px',
      ...options
    });
    
    setObserver(obs);
    
    return () => obs.disconnect();
  }, []);

  return [entries, observer];
};

// BlurFade component
const BlurFade = ({ children, delay = 0, inView = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState(null);
  const [entries, observer] = useIntersectionObserver();

  useEffect(() => {
    if (ref && observer) {
      observer.observe(ref);
    }
    
    return () => {
      if (ref && observer) {
        observer.unobserve(ref);
      }
    };
  }, [ref, observer]);

  useEffect(() => {
    const entry = entries.find(entry => entry.target === ref);
    if (entry?.isIntersecting) {
      setTimeout(() => setIsVisible(true), delay * 1000);
    }
  }, [entries, ref, delay]);

  return (
    <div
      ref={setRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 blur-none transform translate-y-0' 
          : 'opacity-0 blur-md transform translate-y-8'
      }`}
    >
      {children}
    </div>
  );
};

const Categories = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Fetch categories from API
  const { data, isLoading, isError } = useGetAllCategoriesQuery();

  // Transform API data to match component structure
  const categories = (data?.categories || []).map(item => ({
    name: item.title,
    images: [item.categoryPrimaryImage, item.categorySecondaryImage].filter(Boolean),
    description: item.shortDesc,
    category: item.category,
    features: item.features || [],
    startingFrom: item.startingFrom
  }));

  // Continuous scrolling effect
  useEffect(() => {
    if (!scrollRef.current || categories.length === 0) return;

    const scrollContainer = scrollRef.current;
    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = scrollContainer.clientWidth;
    
    if (scrollWidth <= clientWidth) return; // No need to scroll if content fits

    let scrollPosition = 0;
    const scrollSpeed = 1; // pixels per frame
    const frameRate = 60; // frames per second
    const interval = 1000 / frameRate;

    const scroll = () => {
      if (!isScrolling) return;
      
      scrollPosition += scrollSpeed;
      if (scrollPosition >= scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
    };

    const scrollInterval = setInterval(scroll, interval);

    return () => clearInterval(scrollInterval);
  }, [categories, isScrolling]);

  // Pause scrolling on hover
  const handleContainerMouseEnter = () => {
    setIsScrolling(false);
  };

  const handleContainerMouseLeave = () => {
    setIsScrolling(true);
  };

  // Start scrolling when component mounts
  useEffect(() => {
    setIsScrolling(true);
  }, []);

  const handleMouseEnter = (index) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(index);
      setIsHovered(true);
    }, 50);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
      if (!selectedItem) {
        setIsHovered(false);
      }
    }, 100);
  };

  const handleCloseModal = () => {
    setIsTransitioning(true);
    setIsModalOpen(false);
    setCardHovered(false);
    
    setTimeout(() => {
      setSelectedItem(null);
      setIsTransitioning(false);
      setIsHovered(false);
    }, 600);
  };

  const handleItemClick = (index) => {
    setSelectedItem(categories[index]);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
    setCardHovered(false);
    setIsHovered(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === selectedItem.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedItem.images.length - 1 : prev - 1
    );
  };

  if (isLoading) {
    return (
      <div className="relative w-full py-8 mt-10" style={{
        background: 'linear-gradient(135deg, #fffbe6 0%, #f8f4e6 40%, #e8dcc0 100%)',
        boxShadow: '0 4px 20px rgba(212,175,55,0.08)',
        border: '1px solid #e3b873',
        minHeight: '280px',
      }}>
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-amber-200 rounded-full mx-auto mb-4"></div>
            <div className="text-amber-600 font-serif">Loading Categories...</div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative w-full py-8 mt-10" style={{
        background: 'linear-gradient(135deg, #fffbe6 0%, #f8f4e6 40%, #e8dcc0 100%)',
        boxShadow: '0 4px 20px rgba(212,175,55,0.08)',
        border: '1px solid #e3b873',
        minHeight: '280px',
      }}>
        <div className="text-center text-red-500">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.734-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="font-serif">Failed to load categories.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full py-8 mt-10" style={{
      background: 'linear-gradient(135deg, #fffbe6 0%, #f8f4e6 40%, #e8dcc0 100%)',
      boxShadow: '0 4px 20px rgba(212,175,55,0.08)',
      border: '1px solid #e3b873',
      minHeight: '280px',
    }}>
      {/* Section Header */}
      <BlurFade delay={0.1}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            letterSpacing: '0.02em',
          }}>
            Stitch by Category
          </h2>
          <div className="mx-auto w-16 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
        </div>
      </BlurFade>

      {/* Categories Container with Continuous Scrolling */}
      <div className="relative px-4 md:px-8">
        <div 
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide"
          onMouseEnter={handleContainerMouseEnter}
          onMouseLeave={handleContainerMouseLeave}
        >
          <div className="flex gap-8 md:gap-12 justify-start" style={{ minWidth: 'max-content' }}>
            {/* Duplicate categories for seamless scrolling */}
            {[...categories, ...categories].map((category, index) => (
              <BlurFade key={index} delay={0.2 + (index % categories.length) * 0.08}>
                <div
                  className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
                  onClick={() => handleItemClick(index % categories.length)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Larger Circular Image */}
                  <div 
                    className="relative mb-4 overflow-hidden rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                    style={{
                      width: '140px',
                      height: '140px',
                      background: 'linear-gradient(135deg, #fffbe6 0%, #f3edea 60%, #e0d3c0 100%)',
                      border: '2px solid #e3b873',
                      boxShadow: '0 4px 15px rgba(212,175,55,0.15)',
                    }}
                  >
                    {/* Animated golden glow on hover */}
                    <div className="absolute inset-0 rounded-full pointer-events-none z-10">
                      <div className={`w-full h-full rounded-full transition-all duration-500 ${
                        hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                      }`} style={{
                        background: 'radial-gradient(circle, rgba(227,184,115,0.22) 0%, rgba(227,184,115,0.12) 60%, transparent 100%)',
                        animation: hoveredIndex === index ? 'pulse-glow 2.2s infinite cubic-bezier(0.4,0,0.2,1)' : 'none',
                      }} />
                    </div>
                    
                    {/* First image (default) */}
                    <img
                      src={category.images[0]}
                      alt={category.name}
                      className={`w-full h-full object-cover transition-all duration-700 ease-out absolute top-0 left-0 ${
                        hoveredIndex === index ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                      }`}
                      style={{
                        filter: hoveredIndex === index ? 'blur(2px) brightness(0.8)' : 'blur(0px) brightness(1.02)',
                        transform: hoveredIndex === index ? 'scale(1.05) rotate(0.3deg)' : 'scale(1) rotate(0deg)',
                        transformOrigin: 'center center',
                      }}
                    />
                    
                    {/* Second image (on hover) */}
                    {category.images[1] && (
                      <img
                        src={category.images[1]}
                        alt={`${category.name} alternate`}
                        className={`w-full h-full object-cover absolute top-0 left-0 transition-all duration-700 ease-out ${
                          hoveredIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
                        }`}
                        style={{
                          filter: hoveredIndex === index ? 'blur(0px) brightness(1.05) contrast(1.03)' : 'blur(3px) brightness(0.9)',
                          transform: hoveredIndex === index ? 'scale(1) rotate(0deg)' : 'scale(0.98) rotate(-0.3deg)',
                          transformOrigin: 'center center',
                        }}
                      />
                    )}
                    
                    {/* Subtle shine effect on hover */}
                    <div className={`absolute inset-0 rounded-full transition-all duration-500 ease-out ${
                      hoveredIndex === index ? 'opacity-30' : 'opacity-0'
                    }`} style={{
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                      transform: 'translateX(-100%)',
                      animation: hoveredIndex === index ? 'shine 2s ease-out infinite' : 'none'
                    }} />
                  </div>
                  
                  {/* Category Name in CAPS */}
                  <div className="text-center">
                    <h3 className="text-base font-bold text-gray-800 transition-all duration-300 group-hover:text-amber-700 group-hover:scale-105 tracking-wider" style={{
                      fontFamily: "'Inter', sans-serif",
                      letterSpacing: '0.05em',
                      lineHeight: '1.2',
                      textTransform: 'uppercase',
                    }}>
                      {category.name}
                    </h3>
                    
                    {/* Hover underline with gradient */}
                    <div className="mt-2 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full transition-all duration-500 ease-out group-hover:w-full w-0 mx-auto shadow-sm" />
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Modal with Beautiful UI */}
      {isModalOpen && selectedItem && (
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-500 p-4 ${
            isModalOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleCloseModal}
        >
          <div
            className={`relative bg-white rounded-2xl lg:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transition-all duration-700 ${
              isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #f8f8f8 100%)',
              border: '1px solid rgba(227, 184, 115, 0.2)',
            }}
          >
            {/* Enhanced Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 lg:top-6 lg:right-6 z-20 w-8 h-8 lg:w-10 lg:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border border-gray-200"
            >
              <X size={16} className="lg:w-[18px] lg:h-[18px] text-gray-600" />
            </button>

            {/* Modal Content with Enhanced Layout */}
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Image Section */}
              <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 xl:p-12">
                <div 
                  className="relative"
                  onMouseEnter={() => setCardHovered(true)}
                  onMouseLeave={() => setCardHovered(false)}
                >
                  {/* Main Image Container */}
                  <div className="relative overflow-hidden rounded-xl lg:rounded-2xl shadow-2xl">
                    {/* First image (default) */}
                    <img
                      src={selectedItem.images[currentImageIndex]}
                      alt={selectedItem.name}
                      className={`w-full h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px] object-cover transition-all duration-700 ease-out ${
                        cardHovered && selectedItem.images[1] ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                      }`}
                      style={{
                        filter: cardHovered && selectedItem.images[1] ? 'blur(2px) brightness(0.8)' : 'blur(0px) brightness(1)',
                        transform: cardHovered && selectedItem.images[1] ? 'scale(1.05) rotate(0.3deg)' : 'scale(1) rotate(0deg)',
                        transformOrigin: 'center center',
                      }}
                    />
                    
                    {/* Second image (on hover) */}
                    {selectedItem.images[1] && (
                      <img
                        src={selectedItem.images[1]}
                        alt={`${selectedItem.name} alternate`}
                        className={`w-full h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px] object-cover absolute top-0 left-0 transition-all duration-700 ease-out ${
                          cardHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
                        }`}
                        style={{
                          filter: cardHovered ? 'blur(0px) brightness(1.05) contrast(1.03)' : 'blur(3px) brightness(0.9)',
                          transform: cardHovered ? 'scale(1) rotate(0deg)' : 'scale(0.98) rotate(-0.3deg)',
                          transformOrigin: 'center center',
                        }}
                      />
                    )}

                    {/* Image Navigation */}
                    {selectedItem.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10 hover:scale-110"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-10 hover:scale-110"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Image Indicators */}
                  {selectedItem.images.length > 1 && (
                    <div className="flex justify-center mt-4 sm:mt-6 space-x-2 sm:space-x-3">
                      {selectedItem.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                            index === currentImageIndex 
                              ? 'bg-amber-500 scale-125 shadow-lg' 
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Content Section */}
              <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col justify-center">
                {/* Category Badge */}
                <div className="mb-3 sm:mb-4">
                  <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-xs sm:text-sm font-semibold tracking-wide uppercase">
                    {selectedItem.category}
                  </span>
                </div>

                {/* Category Name */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 tracking-wide" style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}>
                  {selectedItem.name}
                </h2>
                
                {/* Elegant divider */}
                <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full mb-4 sm:mb-6"></div>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
                  {selectedItem.description || `Explore our curated collection of ${selectedItem.name.toLowerCase()}. Discover quality pieces that reflect your unique style and personality.`}
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star size={16} className="sm:w-5 sm:h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">Premium Quality</p>
                      <p className="text-xs sm:text-sm text-gray-600">Handcrafted Excellence</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Eye size={16} className="sm:w-5 sm:h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">Custom Design</p>
                      <p className="text-xs sm:text-sm text-gray-600">Tailored to Perfection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.22;
            transform: scale(1);
          }
          50% {
            opacity: 0.35;
            transform: scale(1.05);
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Categories;