import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllFabricsQuery } from '@/features/api/fabricApi';

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

const Fabric = () => {
  const { data, isLoading, isError } = useGetAllFabricsQuery({ page: 1, limit: 4 });
  const fabrics = (data?.fabrics || []);

  return (
    <section className="relative py-12 md:py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Overlays */}
      <SectionOverlay position="top-left" size="38%" opacity={0.18} />
      <SectionOverlay position="top-right" size="32%" opacity={0.16} />
      <SectionOverlay position="bottom-left" size="28%" opacity={0.14} />
      <SectionOverlay position="bottom-right" size="36%" opacity={0.17} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Enhanced Header Section */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-6 md:mb-20">
            {/* Decorative Icon */}
            <div className="mb-6 md:mb-8 animate-pulse">
              <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto text-amber-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 40 L30 20 L50 10 L70 20 L80 40 L70 60 L50 70 L30 60 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="50" cy="40" r="8" fill="currentColor"/>
                <path d="M40 50 L60 50 M45 55 L55 55 M42 60 L58 60" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            
            {/* Subtitle */}
            <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 md:mb-6 font-serif animate-fadeInUp">
              CRAFTED WITH EXCELLENCE
            </h2>
            
            {/* Main Title */}
            <h1 className="text-2xl xs:text-3xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-4 font-serif leading-tight px-2 xs:px-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Featured Fabrics Collection
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
              "Discover our curated selection of premium fabrics, each chosen for its exceptional quality and timeless appeal"
            </p>
            
            {/* CTA Button */}
            <div className="flex justify-center animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
              <Link to="/fabrics">
                <button
                  className="border-2 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-serif tracking-wider shadow-md transition-all duration-300 uppercase"
                  style={{ borderRadius: 0, background: '#e3b873', color: '#222', borderColor: '#e3b873' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#e3b873'; e.currentTarget.style.borderColor = '#222'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#e3b873'; e.currentTarget.style.color = '#222'; e.currentTarget.style.borderColor = '#e3b873'; }}
                >
                  VIEW ALL FABRICS
                </button>
              </Link>
            </div>
          </div>
        </BlurFade>

        {isLoading && (
          <div className="flex justify-center items-center min-h-[120px]">
            <span className="text-amber-600 font-serif">Loading Fabrics...</span>
          </div>
        )}
        {isError && (
          <div className="flex justify-center items-center min-h-[120px]">
            <span className="text-red-500 font-serif">Failed to load fabrics.</span>
          </div>
        )}

        {/* Fabric Grid with Staggered Animation */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {fabrics.map((fabric, index) => (
              <BlurFade key={fabric._id} delay={0.3 + index * 0.08}>
                <div 
                  className="flex flex-col items-center animate-fadeInUp"
                  style={{ animationDelay: `${1 + index * 0.15}s` }}
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden group rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500">
                    {/* Background Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-10"></div>
                    <img
                      src={fabric.fabricImage}
                      alt={fabric.name}
                      className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:opacity-0"
                      style={{ willChange: 'transform, opacity' }}
                    />
                    {/* Transition Overlay */}
                    <div
                      className="absolute top-0 left-0 w-full h-full pointer-events-none transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-60"
                      style={{ background: 'rgba(227, 184, 115, 0.3)', zIndex: 15 }}
                    />
                    {fabric.secondaryFabricImage && (
                      <img
                        src={fabric.secondaryFabricImage}
                        alt={fabric.name + ' alternate'}
                        className="w-full h-full object-cover absolute top-0 left-0 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-110"
                        style={{ willChange: 'transform, opacity', zIndex: 20 }}
                      />
                    )}
                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 border-2 border-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" style={{ zIndex: 25 }}></div>
                  </div>
                  <div className="mt-3 sm:mt-4 text-center">
                    <h3 className="text-base sm:text-lg font-medium font-serif mb-1 sm:mb-2 group-hover:text-amber-700 transition-colors duration-300">{fabric.name}</h3>
                    <div className="text-sm sm:text-base font-serif text-gray-600 tracking-wide italic">₹ {fabric.pricePerMeter ? fabric.pricePerMeter.toLocaleString('en-IN') : ''}/m</div>
                    {/* Decorative Underline */}
                    <div className="mt-2 h-px w-8 bg-gradient-to-r from-amber-300 to-amber-500 mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
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

export default Fabric;