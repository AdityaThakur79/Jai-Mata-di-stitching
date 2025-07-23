import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllItemMastersQuery } from '@/features/api/itemApi';

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

const SectionOverlay = ({ position, size, opacity }) => {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} pointer-events-none`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(227, 184, 115, ${opacity}) 0%, transparent 70%)`,
        zIndex: 1,
      }}
    />
  );
};

const WomenItems = () => {
  const { data, isLoading, isError } = useGetAllItemMastersQuery({ page: 1, limit: 12, category: 'women' });
  const items = (data?.items || []).slice(0, 4);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-rose-200 rounded-full mx-auto mb-4"></div>
          <div className="text-rose-600 font-serif">Loading Women's Collection...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.734-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="font-serif">Failed to load women's items.</div>
      </div>
    );
  }

  return (
    <section className="relative py-12 md:py-20 bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Modern Overlays */}
      <SectionOverlay position="top-left" size="38%" opacity={0.18} />
      <SectionOverlay position="top-right" size="32%" opacity={0.16} />
      <SectionOverlay position="bottom-left" size="28%" opacity={0.14} />
      <SectionOverlay position="bottom-right" size="36%" opacity={0.17} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Enhanced Header Section */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-12 md:mb-20">
            {/* Decorative Icon */}
            <div className="mb-6 md:mb-8 animate-pulse">
              <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto text-amber-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10 L60 30 L50 35 L40 30 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M35 30 L65 30 L60 50 L40 50 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M40 50 L45 70 L55 70 L60 50" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="50" cy="40" r="4" fill="currentColor"/>
                <path d="M30 75 L70 75 M35 80 L65 80" stroke="currentColor" strokeWidth="2"/>
                <path d="M45 20 L55 20" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            
            {/* Subtitle */}
            <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 md:mb-6 font-serif animate-fadeInUp">
              ELEGANCE REDEFINED
            </h2>
            
            {/* Main Title */}
            <h1 className="text-2xl xs:text-3xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-4 font-serif leading-tight px-2 xs:px-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Women's Couture Collection
            </h1>
            
            {/* Decorative Divider */}
            <div className="flex justify-center mb-6 md:mb-8 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-6 md:w-8 h-px bg-amber-300"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-amber-400 rounded-full"></div>
                <div className="w-6 md:w-8 h-px bg-amber-300"></div>
              </div>
            </div>
            
            {/* Subtitle Description */}
            <p className="text-sm md:text-base text-gray-600 italic max-w-2xl mx-auto font-light leading-relaxed mb-8 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              "Timeless elegance meets contemporary style in our curated women's collection"
            </p>
            
            {/* CTA Button */}
            <div className="flex justify-center animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
              <Link to="/women">
                <button
                  className="border-2 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-serif tracking-wider shadow-md transition-all duration-300 uppercase"
                  style={{ borderRadius: 0, background: '#e3b873', color: '#222', borderColor: '#e3b873' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#e3b873'; e.currentTarget.style.borderColor = '#222'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#e3b873'; e.currentTarget.style.color = '#222'; e.currentTarget.style.borderColor = '#e3b873'; }}
                >
                  EXPLORE COLLECTION
                </button>
              </Link>
            </div>
          </div>
        </BlurFade>

        {/* Items Grid with Staggered Animation */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {items.map((item, index) => (
            <BlurFade key={item._id} delay={0.3 + index * 0.08}>
              <div 
                className="flex flex-col items-center animate-fadeInUp"
                style={{ animationDelay: `${1 + index * 0.15}s` }}
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden group rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Background Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 opacity-0 group-hover:opacity-40 transition-opacity duration-500 z-10"></div>
                  
                  <img
                    src={item.itemImage || '/images/placeholder.png'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:opacity-0"
                    style={{ willChange: 'transform, opacity' }}
                  />
                  
                  {/* Transition Overlay */}
                  <div
                    className="absolute top-0 left-0 w-full h-full pointer-events-none transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-60"
                    style={{ background: 'rgba(227, 184, 115, 0.3)', zIndex: 15 }}
                  />
                  
                  <img
                    src={item.secondaryItemImage || item.itemImage || '/images/placeholder.png'}
                    alt={item.name + ' alternate'}
                    className="w-full h-full object-cover absolute top-0 left-0 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-110"
                    style={{ willChange: 'transform, opacity', zIndex: 20 }}
                  />
                  
                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 border-2 border-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" style={{ zIndex: 25 }}></div>
                </div>
                
                <div className="mt-3 sm:mt-4 text-center">
                  <h3 className="text-base sm:text-lg font-medium font-serif mb-1 sm:mb-2 group-hover:text-amber-700 transition-colors duration-300">{item.name}</h3>
                  <div className="text-sm sm:text-base font-serif text-gray-600 tracking-wide italic">
                    ₹ {item.stitchingCharge?.toLocaleString('en-IN') || 0}
                  </div>
                  
                  {/* Decorative Underline with Gradient */}
                  <div className="mt-2 h-px w-12 bg-gradient-to-r from-rose-300 via-amber-300 to-pink-300 mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Floating Hearts Animation */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>
                      <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
        
        {/* Show message if no items */}
        {items.length === 0 && !isLoading && (
          <BlurFade delay={0.5}>
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-gray-500 font-serif italic">No items available in our collection at the moment</p>
            </div>
          </BlurFade>
        )}
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .animate-fadeInUp {
            animation-duration: 0.6s;
          }
        }
      `}</style>
    </section>
  );
};

export default WomenItems;