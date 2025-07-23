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

const WomenHeroSection = () => {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 overflow-hidden">
      {/* Modern Overlays */}
      <SectionOverlay position="top-left" size="40%" opacity={0.15} />
      <SectionOverlay position="center-right" size="35%" opacity={0.12} />
      <SectionOverlay position="bottom-left" size="45%" opacity={0.18} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Right Side - Image (appears first on mobile, right on desktop) */}
          <div className="order-1 lg:order-2">
            <BlurFade delay={0.2} direction="right">
              <div className="relative group">
                {/* Main Image Container */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-pink-800 to-amber-900 opacity-20 z-10"></div>
                  
                  {/* Main Image */}
                  <img
 src='./images/womenherosection.jpeg'                    alt="Elegant Woman"
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  
                  {/* Overlay Border Effect */}
                  <div className="absolute inset-0 border-4 border-rose-400 opacity-0 group-hover:opacity-60 transition-all duration-500 rounded-2xl"></div>
                  
                  {/* Floating Accent Elements */}
                  <div className="absolute top-6 left-6 w-16 h-16 bg-rose-400 bg-opacity-20 rounded-full backdrop-blur-sm border border-rose-300 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                  <div className="absolute bottom-6 right-6 w-12 h-12 bg-pink-300 bg-opacity-30 rounded-full backdrop-blur-sm border border-pink-200 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-400"></div>
                  
                  {/* Floating Hearts */}
                  <div className="absolute top-1/3 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                    <svg className="w-6 h-6 text-rose-300 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <div className="absolute bottom-1/3 left-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-500">
                    <svg className="w-4 h-4 text-pink-300 animate-bounce" fill="currentColor" viewBox="0 0 20 20" style={{ animationDelay: '0.2s' }}>
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-rose-300 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-rose-200 to-pink-200 rounded-full opacity-20 blur-xl"></div>
                
                {/* Sparkle Effects */}
                <div className="absolute top-8 right-12 w-2 h-2 bg-rose-400 rounded-full opacity-70 animate-ping"></div>
                <div className="absolute bottom-12 left-8 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-60 animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
            </BlurFade>
          </div>

          {/* Left Side - Content (appears second on mobile, left on desktop) */}
          <div className="space-y-8 order-2 lg:order-1">
            <BlurFade delay={0.4} direction="left">
              {/* Subtitle */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-px bg-rose-400"></div>
                <span className="text-xs font-bold text-rose-600 tracking-[0.3em] uppercase font-serif">
                  THE ESSENCE OF MODERN FEMININITY
                </span>
                <div className="w-12 h-px bg-rose-400"></div>
              </div>
            </BlurFade>

            <BlurFade delay={0.6} direction="left">
              {/* Main Heading */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-800 leading-tight font-serif mb-4">
                Unveil Your
                <br />
                <span className="text-rose-600 font-medium italic">Radiance</span>
                <br />
                with JMD
              </h1>
              <h2 className="text-lg md:text-2xl text-rose-500 font-serif font-light italic mb-2 md:mb-4">
                "Where every stitch celebrates your story."
              </h2>
            </BlurFade>

            <BlurFade delay={0.8} direction="left">
              {/* Description */}
              <div className="space-y-6">
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
                  Discover a collection designed for the woman who leads with grace and strength. At JMD, we blend timeless artistry with contemporary flair, crafting garments that empower you to express your individuality.
                </p>
                <div className="border-l-4 border-rose-400 pl-6 py-4 bg-gradient-to-r from-rose-50 to-transparent rounded-r-lg">
                  <p className="text-gray-700 italic font-serif">
                    "Every woman is a muse. Our creations are inspired by your dreams, your confidence, and your journey."
                  </p>
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={1.0} direction="left">
              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-6 py-8">
                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center group-hover:from-rose-200 group-hover:to-pink-300 transition-all duration-300">
                    <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-gray-800 font-medium mb-2">Luxurious Fabrics</h3>
                  <p className="text-sm text-gray-600">Sourced for softness, drape, and lasting beauty</p>
                </div>
                <div className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center group-hover:from-rose-200 group-hover:to-pink-300 transition-all duration-300">
                    <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-gray-800 font-medium mb-2">Signature Details</h3>
                  <p className="text-sm text-gray-600">Thoughtful accents for a look that’s uniquely yours</p>
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={1.2} direction="left">
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/women"
                  className="border-2 px-4 sm:px-8 py-1.5 sm:py-2 text-base sm:text-lg font-serif tracking-wider shadow-md transition-all duration-300 uppercase"
                  style={{ borderRadius: 0, background: '#e3b873', color: '#222', borderColor: '#e3b873' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#e3b873'; e.currentTarget.style.borderColor = '#222'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#e3b873'; e.currentTarget.style.color = '#222'; e.currentTarget.style.borderColor = '#e3b873'; }}
                >
                  Explore Collection
                </Link>
                <a href='/gallery'
                  className="border-2 px-4 sm:px-8 py-1.5 sm:py-2 text-base sm:text-lg font-serif tracking-wider shadow-md transition-all duration-300 uppercase"
                  style={{ borderRadius: 0, background: '#fff', color: '#222', borderColor: '#e3b873' }}
                  onMouseOver={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#e3b873'; e.currentTarget.style.borderColor = '#222'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#222'; e.currentTarget.style.borderColor = '#e3b873'; }}
                >
                  See Work
                </a>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
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
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
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

export default WomenHeroSection;