import React, { useState, useRef, useEffect } from 'react'

const categories = [
  { 
    name: 'Jeans', 
    images: ['/images/jeans.png', '/images/jeanss2.png'] 
  },
  { 
    name: 'Kurtas', 
      images: ['/images/kurta1.jpg', '/images/kurta2.jpg'] 
  },
  { 
    name: 'Pathanis', 
    images: ['/images/pathani1.jpg', '/images/pathani2.jpg'] 
  },
  { 
    name: 'Shirts', 
    images: ['/images/shirts1.jpg', '/images/shirt2.png'] 
  },
  { 
    name: 'Suits', 
    images: ['/images/suit1.jpg', '/images/suit2.jpg'] 
  },
  { 
    name: 'Trousers', 
    images: ['/images/trouser1.jpg', '/images/trouser2.jpg'] 
  },
  { 
    name: 'T-Shirts', 
    images: ['/images/tshirt.jpg', '/images/tshirt2.webp'] 
  },
  { 
    name: 'Black with Stuc', 
    images: ['/images/formal1.jpg', '/images/formal2.jpg'] 
  },
  { 
    name: 'Jodhpuris', 
    images: ['/images/jodh1.png', '/images/jiodh2.jpg'] 
  },
  { 
    name: 'Kurtas', 
    images: ['/images/kurta1.jpg', '/images/kurta2.jpg'] 
  },
  { 
    name: 'Garments', 
    images: ['/images/jmd_logo.jpeg', '/images/jmd_logo2.jpeg'] 
  },
];

const Categories = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const scrollRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Smooth scroll control
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    if (isHovered || selectedItem) {
      element.style.animationPlayState = 'paused';
    } else {
      element.style.animationPlayState = 'running';
    }
  }, [isHovered, selectedItem]);

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Add slight delay to prevent jittery behavior
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 50);
  };

  const handleMouseLeave = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Add delay before resuming animation
    hoverTimeoutRef.current = setTimeout(() => {
      if (!selectedItem) {
        setIsHovered(false);
      }
    }, 100);
  };

  const handleCloseModal = () => {
    setIsTransitioning(true);
    setSelectedItem(null);
    setCardHovered(false);
    
    // Smooth transition out
    setTimeout(() => {
      setIsTransitioning(false);
      setIsHovered(false);
    }, 600);
  };

  const handleItemClick = (index) => {
    const actualIndex = index >= categories.length ? 0 : index;
    setSelectedItem({ index: actualIndex, setIndex: 0 });
    setCardHovered(false);
    setIsHovered(true);
  };

  return (
    <div className="relative w-full overflow-hidden py-12 mt-10" style={{
      background: 'linear-gradient(120deg, #fffbe6 0%, #f8f4e6 40%, #e8dcc0 100%)',
      boxShadow: '0 8px 32px rgba(212,175,55,0.07), 0 2px 8px rgba(0,0,0,0.06), 0 0.5px 1.5px rgba(227,184,115,0.08)',
      border: '1.5px solid #e3b873',
      minHeight: '400px',
    }}>
      {/* Decorative overlay with subtle pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.3) 0%, transparent 50%)',
      }} />
      
      {/* Subtle texture pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(139,69,19,0.1) 1px, transparent 0)',
        backgroundSize: '30px 30px',
      }} />

      {/* Modal overlay for enlarged image */}
      {(selectedItem || isTransitioning) && (
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-600 ease-out ${
            selectedItem && !isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleCloseModal}
          style={{ zIndex: 9999, paddingTop: '40px', paddingBottom: '40px', boxSizing: 'border-box' }}
        >
          <div className="relative">
            {/* Classic card with enhanced smooth transitions */}
            <div 
              className={`bg-white transform transition-all duration-600 ease-out cursor-pointer ${
                selectedItem && !isTransitioning ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
              }`}
              onMouseEnter={() => setCardHovered(true)}
              onMouseLeave={() => setCardHovered(false)}
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: `
                  0 25px 50px rgba(0,0,0,0.25),
                  0 12px 25px rgba(0,0,0,0.15),
                  0 6px 12px rgba(0,0,0,0.1),
                  inset 0 1px 0 rgba(255,255,255,0.9),
                  inset 0 -1px 0 rgba(0,0,0,0.05)
                `,
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '40px',
                paddingTop: '32px',
                paddingBottom: '32px',
                width: '500px',
                minHeight: '600px'
              }}
            >
              {/* Close button */}
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-gray-800 rounded-full"
                style={{
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                ×
              </button>

              {/* Image container */}
              <div className="relative overflow-hidden shadow-lg border border-gray-200" style={{ width: '100%', height: '400px' }}>
                {/* First image */}
                <img
                  src={selectedItem ? categories[selectedItem.index].images[0] : '/images/jeans.png'}
                  alt={selectedItem ? categories[selectedItem.index].name : ''}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                    cardHovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                  }`}
                  style={{
                    filter: cardHovered ? 'blur(2px) brightness(0.8)' : 'blur(0px) brightness(1)',
                    transform: cardHovered ? 'scale(1.05) rotate(0.3deg)' : 'scale(1) rotate(0deg)',
                    transformOrigin: 'center center'
                  }}
                />
                
                {/* Second image */}
                <img
                  src={selectedItem ? categories[selectedItem.index].images[1] : '/images/jeanss2.png'}
                  alt={selectedItem ? `${categories[selectedItem.index].name} alternate` : ''}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                    cardHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
                  }`}
                  style={{
                    filter: cardHovered ? 'blur(0px) brightness(1.05) contrast(1.03)' : 'blur(3px) brightness(0.9)',
                    transform: cardHovered ? 'scale(1) rotate(0deg)' : 'scale(0.98) rotate(-0.3deg)',
                    transformOrigin: 'center center'
                  }}
                />
                
                {/* Elegant transition overlay */}
                <div 
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    cardHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 70%, transparent 100%)',
                    transform: cardHovered ? 'translateX(0)' : 'translateX(-100%)'
                  }}
                />

                {/* Hover instruction overlay */}
                <div 
                  className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-500 ease-out ${
                    cardHovered ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <div className="text-white text-center px-6 py-3 bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg">
                    <p className="text-sm font-medium">Hover to see alternate view</p>
                  </div>
                </div>
              </div>
              
              {/* Content section */}
              <div className="mt-8 text-center">
                <h3 className={`text-3xl font-bold text-gray-800 mb-4 transition-all duration-600 ease-out ${
                  selectedItem && !isTransitioning ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  letterSpacing: '0.02em',
                  textShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {selectedItem ? categories[selectedItem.index].name : ''}
                </h3>
                
                {/* Elegant divider */}
                <div className={`mx-auto mb-6 transition-all duration-600 ease-out ${
                  selectedItem && !isTransitioning ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                }`}
                style={{
                  width: '80px',
                  height: '2px',
                  background: 'linear-gradient(to right, #d4af37, #ffd700, #d4af37)',
                  boxShadow: '0 1px 3px rgba(212,175,55,0.3)'
                }}></div>
                
                {/* Image indicators */}
                <div className="flex justify-center space-x-3 mb-6">
                  <div className={`w-3 h-3 border-2 transition-all duration-500 ease-out rounded-full ${
                    !cardHovered ? 'border-amber-500 bg-amber-500 scale-110' : 'border-gray-400 bg-transparent scale-100'
                  }`} 
                  style={{
                    boxShadow: !cardHovered ? '0 2px 8px rgba(245,158,11,0.4)' : 'none'
                  }}/>
                  <div className={`w-3 h-3 border-2 transition-all duration-500 ease-out rounded-full ${
                    cardHovered ? 'border-amber-500 bg-amber-500 scale-110' : 'border-gray-400 bg-transparent scale-100'
                  }`}
                  style={{
                    boxShadow: cardHovered ? '0 2px 8px rgba(245,158,11,0.4)' : 'none'
                  }}/>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-base leading-relaxed mb-6 px-4 transition-all duration-600 ease-out" style={{
                  fontFamily: "'Inter', sans-serif"
                }}>
                  Explore our premium collection with detailed craftsmanship and quality materials.
                </p>
                
                {/* Action buttons */}
                <div className="flex justify-center space-x-4">
                  <button 
                    className="px-6 py-3 bg-amber-500 text-white font-medium hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg"
                    style={{
                      boxShadow: '0 4px 12px rgba(245,158,11,0.3)',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  >
                    View Details
                  </button>
                  <button 
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg"
                    style={{
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(0,0,0,0.1)'
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="whitespace-nowrap flex items-center justify-center animate-categories-scroll"
        style={{
          animationDuration: `${categories.length * 8}s`,
          width: `${(categories.length + 1) * 340}px`,
          willChange: 'transform'
        }}
      >
        {categories.concat([categories[0]]).map((cat, i) => (
          <div 
            key={i} 
            className="flex flex-col items-center mx-6 min-w-[220px] group cursor-pointer relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleItemClick(i)}
            style={{ willChange: 'transform' }}
          >
            <div className="mb-4 flex-shrink-0 relative transform transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2 overflow-hidden rounded-full border-2 border-gray-200/70 group-hover:border-amber-300 shadow-lg group-hover:shadow-xl" 
            style={{ 
              width: 220, 
              height: 220, 
              aspectRatio: '1 / 1', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 'linear-gradient(135deg, #fffbe6 0%, #f3edea 60%, #e0d3c0 100%)',
              border: '2.5px solid #e3b873',
              boxShadow: '0 8px 32px rgba(212,175,55,0.08), 0 2px 8px rgba(0,0,0,0.08)',
              willChange: 'transform'
            }}>
              {/* Animated golden glow on hover */}
              <div className="absolute inset-0 rounded-full pointer-events-none z-10">
                <div className="w-full h-full rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" style={{
                  background: 'radial-gradient(circle, rgba(227,184,115,0.22) 0%, rgba(227,184,115,0.12) 60%, transparent 100%)',
                  animation: 'pulse-glow 2.2s infinite cubic-bezier(0.4,0,0.2,1)',
                }} />
              </div>
              
              <img
                src={cat.images[0]}
                alt={cat.name}
                className="transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
                style={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: '50%',
                  filter: 'brightness(1.02) contrast(1.05) saturate(1.1)',
                  display: 'block',
                  background: '#fff',
                  willChange: 'transform, filter'
                }}
              />
              
              {/* Subtle shine effect on hover */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 ease-out" style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                transform: 'translateX(-100%)',
                animation: 'shine 2s ease-out infinite'
              }} />
            </div>
            
            {/* Category name with enhanced styling */}
            <div
              className="text-center transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1"
              style={{
                color: '#b08d57',
                fontWeight: 700,
                fontSize: '1.25rem',
                letterSpacing: '0.045em',
                textShadow: '0 2px 8px rgba(227,184,115,0.13), 0 1px 2px rgba(0,0,0,0.08)',
                lineHeight: 1.3,
                fontFamily: "'Playfair Display', serif",
                willChange: 'transform'
              }}
            >
              {cat.name}
            </div>
            
            {/* Hover underline with gradient */}
            <div className="mt-2 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full transition-all duration-500 ease-out group-hover:w-full w-0 shadow-sm" />
          </div>
        ))}
          {categories.concat([categories[0]]).map((cat, i) => (
          <div 
            key={i} 
            className="flex flex-col items-center mx-6 min-w-[220px] group cursor-pointer relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleItemClick(i)}
            style={{ willChange: 'transform' }}
          >
            <div className="mb-4 flex-shrink-0 relative transform transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2 overflow-hidden rounded-full border-2 border-gray-200/70 group-hover:border-amber-300 shadow-lg group-hover:shadow-xl" 
            style={{ 
              width: 220, 
              height: 220, 
              aspectRatio: '1 / 1', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: 'linear-gradient(135deg, #fffbe6 0%, #f3edea 60%, #e0d3c0 100%)',
              border: '2.5px solid #e3b873',
              boxShadow: '0 8px 32px rgba(212,175,55,0.08), 0 2px 8px rgba(0,0,0,0.08)',
              willChange: 'transform'
            }}>
              {/* Animated golden glow on hover */}
              <div className="absolute inset-0 rounded-full pointer-events-none z-10">
                <div className="w-full h-full rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" style={{
                  background: 'radial-gradient(circle, rgba(227,184,115,0.22) 0%, rgba(227,184,115,0.12) 60%, transparent 100%)',
                  animation: 'pulse-glow 2.2s infinite cubic-bezier(0.4,0,0.2,1)',
                }} />
              </div>
              
              <img
                src={cat.images[0]}
                alt={cat.name}
                className="transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
                style={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: '1 / 1',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: '50%',
                  filter: 'brightness(1.02) contrast(1.05) saturate(1.1)',
                  display: 'block',
                  background: '#fff',
                  willChange: 'transform, filter'
                }}
              />
              
              {/* Subtle shine effect on hover */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 ease-out" style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
                transform: 'translateX(-100%)',
                animation: 'shine 2s ease-out infinite'
              }} />
            </div>
            
            {/* Category name with enhanced styling */}
            <div
              className="text-center transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-1"
              style={{
                color: '#b08d57',
                fontWeight: 700,
                fontSize: '1.25rem',
                letterSpacing: '0.045em',
                textShadow: '0 2px 8px rgba(227,184,115,0.13), 0 1px 2px rgba(0,0,0,0.08)',
                lineHeight: 1.3,
                fontFamily: "'Playfair Display', serif",
                willChange: 'transform'
              }}
            >
              {cat.name}
            </div>
            
            {/* Hover underline with gradient */}
            <div className="mt-2 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full transition-all duration-500 ease-out group-hover:w-full w-0 shadow-sm" />
          </div>
        ))}
      </div>

      
      
      <style>{`
        @keyframes categories-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${(categories.length) * 340}px); }
        }
        
        .animate-categories-scroll {
          animation: categories-scroll linear infinite;
          animation-fill-mode: both;
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
        
        /* Smooth hardware acceleration */
        .animate-categories-scroll,
        .group,
        .transform {
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* Enhanced shadow effects for classic design */
        .shadow-3xl {
          box-shadow: 0 20px 50px rgba(0,0,0,0.15), 0 10px 25px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8);
        }
        
        /* Professional button shadows */
        button:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        
        /* Smooth transitions with professional easing */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Optimize performance */
        .animate-categories-scroll {
          will-change: transform;
        }
        
        .group:hover {
          will-change: transform;
        }
        
        /* Prevent layout shifts */
        img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
      `}</style>
    </div>
  )
}

export default Categories