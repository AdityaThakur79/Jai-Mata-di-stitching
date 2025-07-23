import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
const BlurFade = ({ children, delay = 0, direction = 'up' }) => {
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

  const directionClasses = {
    up: 'translate-y-8',
    left: '-translate-x-8',
    right: 'translate-x-8'
  };

  return (
    <div
      ref={setRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 blur-none transform translate-y-0 translate-x-0' 
          : `opacity-0 blur-md transform ${directionClasses[direction]}`
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
    'center-left': 'top-1/2 left-0 -translate-y-1/2',
    'center-right': 'top-1/2 right-0 -translate-y-1/2'
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

const MenHeroSection = () => {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden">
      {/* Modern Overlays */}
      <SectionOverlay position="top-left" size="40%" opacity={0.15} />
      <SectionOverlay position="center-right" size="35%" opacity={0.12} />
      <SectionOverlay position="bottom-left" size="45%" opacity={0.18} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side - Image */}
          <BlurFade delay={0.2} direction="left">
            <div className="relative group">
              {/* Main Image Container */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-800 to-amber-900 opacity-20 z-10"></div>
                
                {/* Main Image */}
                <img
                  src="./images/mensherosection.jpeg"
                  alt="Distinguished Gentleman"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                
                {/* Overlay Border Effect */}
                <div className="absolute inset-0 border-4 border-amber-400 opacity-0 group-hover:opacity-60 transition-all duration-500 rounded-2xl"></div>
                
                {/* Floating Accent Elements */}
                <div className="absolute top-6 right-6 w-16 h-16 bg-amber-400 bg-opacity-20 rounded-full backdrop-blur-sm border border-amber-300 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                <div className="absolute bottom-6 left-6 w-12 h-12 bg-amber-300 bg-opacity-30 rounded-full backdrop-blur-sm border border-amber-200 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-400"></div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-amber-300 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-20 blur-xl"></div>
            </div>
          </BlurFade>

          {/* Right Side - Content */}
          <div className="space-y-8">
            <BlurFade delay={0.4} direction="right">
              {/* Subtitle */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-px bg-amber-400"></div>
                <span className="text-xs font-bold text-amber-600 tracking-[0.3em] uppercase font-serif">
                  CRAFTED FOR EXCELLENCE
                </span>
                <div className="w-12 h-px bg-amber-400"></div>
              </div>
            </BlurFade>

            <BlurFade delay={0.6} direction="right">
              {/* Main Heading */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-800 leading-tight font-serif mb-6">
                Redefining
                <br />
                <span className="text-amber-600 font-medium italic">Masculine</span>
                <br />
                Sophistication
              </h1>
              <h2 className="text-lg md:text-2xl text-amber-600 font-serif font-light italic mb-2 md:mb-4">
                Tailored for Ambition. Crafted for Legacy.
              </h2>
            </BlurFade>

            <BlurFade delay={0.8} direction="right">
              {/* Description */}
              <div className="space-y-6">
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
                  Where timeless craftsmanship meets contemporary design. Our men's collection embodies the perfect balance of classic elegance and modern innovation.
                </p>
                
                <div className="border-l-4 border-amber-400 pl-6 py-4 bg-gradient-to-r from-amber-50 to-transparent rounded-r-lg">
                  <p className="text-gray-700 italic font-serif">
                    "Every stitch tells a story of precision, every fabric whispers tales of luxury, and every design speaks the language of distinguished gentlemen."
                  </p>
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={1.0} direction="right">
              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-6 py-8">
                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-gray-800 font-medium mb-2">Premium Quality</h3>
                  <p className="text-sm text-gray-600">Finest materials sourced globally</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300">
                    <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-gray-800 font-medium mb-2">Expert Tailoring</h3>
                  <p className="text-sm text-gray-600">Masterful craftsmanship in every piece</p>
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={1.2} direction="right">
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/men"
                  className="border-2 px-4 sm:px-8 py-1.5 sm:py-2 text-base sm:text-lg font-serif tracking-wider shadow-md transition-all duration-300 uppercase"
                  style={{ borderRadius: 0, background: '#e3b873', color: '#222', borderColor: '#e3b873' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#e3b873'; e.currentTarget.style.borderColor = '#222'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#e3b873'; e.currentTarget.style.color = '#222'; e.currentTarget.style.borderColor = '#e3b873'; }}
                >
                  Explore Collection
                </Link>
                <Link to="/custom-tailoring"
                  className="border-2 px-4 sm:px-8 py-1.5 sm:py-2 text-base sm:text-lg font-serif tracking-wider shadow-md transition-all duration-300 uppercase"
                  style={{ borderRadius: 0, background: '#fff', color: '#222', borderColor: '#e3b873' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#e3b873'; e.currentTarget.style.borderColor = '#222'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#222'; e.currentTarget.style.borderColor = '#e3b873'; }}
                >
                  Custom Tailoring
                </Link>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .grid.lg\\:grid-cols-2 {
            gap: 3rem;
          }
        }
        
        @media (max-width: 640px) {
          .text-3xl.md\\:text-5xl.lg\\:text-6xl {
            font-size: 2rem;
            line-height: 1.2;
          }
        }
      `}</style>
    </section>
  );
};

export default MenHeroSection;