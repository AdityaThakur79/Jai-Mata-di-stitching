import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    image: '/images/jiodh2.jpg',
    title: 'Jodhpuri Suits',
    description: 'Traditional royal attire'
  },
  {
    image: '/images/suit2.jpg',
    title: 'Premium Suits',
    description: 'Business & formal wear'
  },
  {
    image: '/images/jeanss2.png',
    title: 'Casual Jeans',
    description: 'Comfort & style'
  },
  {
    image: '/images/formal1.jpg',
    title: 'Formal Wear',
    description: 'Professional attire'
  },
  {
    image: '/images/jeans.png',
    title: 'Denim Collection',
    description: 'Custom fit jeans'
  },
  {
    image: '/images/kurta1.jpg',
    title: 'Traditional Kurtas',
    description: 'Ethnic elegance'
  },
  {
    image: '/images/formal2.jpg',
    title: 'Office Formals',
    description: 'Daily professional wear'
  },
  {
    image: '/images/menindark.png',
    title: 'Evening Wear',
    description: 'Special occasions'
  },
  {
    image: '/images/pathani1.jpg',
    title: 'Pathani Suits',
    description: 'Cultural heritage'
  },
  {
    image: '/images/suit1.jpg',
    title: 'Wedding Suits',
    description: 'Special celebration wear'
  },
  {
    image: '/images/trouser1.jpg',
    title: 'Tailored Trousers',
    description: 'Perfect fit guarantee'
  },
  {
    image: '/images/tshirt.jpg',
    title: 'Custom T-Shirts',
    description: 'Casual comfort'
  },
  {
    image: '/images/jodh1.png',
    title: 'Royal Jodhpuri',
    description: 'Regal sophistication'
  },
  {
    image: '/images/shirt2.png',
    title: 'Dress Shirts',
    description: 'Crisp & professional'
  },
  {
    image: '/images/shirts1.jpg',
    title: 'Casual Shirts',
    description: 'Everyday comfort'
  }
];

// Custom hook for intersection observer
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

export default function Services() {
  return (
    <section id="services" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <BlurFade delay={0.1}>
          <h2 className="text-3xl sm:text-4xl text-center mb-4 sm:mb-6 font-serif text-gray-800">
            Our Tailoring Services
          </h2>
        </BlurFade>
        
        <BlurFade delay={0.2}>
          <div className="flex justify-center mb-8 sm:mb-12">
            <Link to="/services"
              className="border-2 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-serif tracking-wider shadow-md transition-all duration-300 uppercase hover:shadow-lg"
              style={{ 
                borderRadius: 0, 
                background: '#e3b873', 
                color: '#222', 
                borderColor: '#e3b873' 
              }}
              onMouseOver={e => { 
                e.currentTarget.style.background = '#222'; 
                e.currentTarget.style.color = '#e3b873'; 
                e.currentTarget.style.borderColor = '#222'; 
              }}
              onMouseOut={e => { 
                e.currentTarget.style.background = '#e3b873'; 
                e.currentTarget.style.color = '#222'; 
                e.currentTarget.style.borderColor = '#e3b873'; 
              }}
            >
              VIEW ALL SERVICES
            </Link>
          </div>
        </BlurFade>

        {/* Clean Grid Layout - 4 columns desktop, 2 columns mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {services.slice(0, 12).map((service, idx) => (
            <BlurFade key={service.image} delay={0.3 + idx * 0.08} inView>
              <div 
                className="relative overflow-hidden rounded-sm shadow-md group cursor-pointer h-64 sm:h-96 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:z-10 border border-gray-200/50 hover:border-[#e3b873]/60"
              >
                <img
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-105"
                  src={service.image}
                  alt={service.title}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-600" />
                
                {/* Content */}
                <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end text-white transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-600 ease-out">
                  <h3 className="text-sm sm:text-base font-bold mb-1 font-serif tracking-wide drop-shadow-lg">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-100 font-light leading-tight drop-shadow-md">
                    {service.description}
                  </p>
                </div>

                {/* Golden shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e3b873]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                
                {/* Additional golden glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f4d03f]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out delay-100" />
              </div>
            </BlurFade>
          ))}
        </div>

        {/* Bottom CTA */}
        <BlurFade delay={0.8}>
          <div className="text-center mt-12 sm:mt-16">
            <p className="text-gray-600 mb-6 font-serif text-lg">
              Expert tailoring with precision and care
            </p>
            <Link to="/custom-tailoring"
              className="border-2 px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-serif tracking-wider shadow-md transition-all duration-300 uppercase hover:shadow-lg"
              style={{ 
                borderRadius: 0, 
                background: 'transparent', 
                color: '#222', 
                borderColor: '#e3b873' 
              }}
              onMouseOver={e => { 
                e.currentTarget.style.background = '#e3b873'; 
                e.currentTarget.style.color = '#222'; 
                e.currentTarget.style.borderColor = '#e3b873'; 
              }}
              onMouseOut={e => { 
                e.currentTarget.style.background = 'transparent'; 
                e.currentTarget.style.color = '#222'; 
                e.currentTarget.style.borderColor = '#e3b873'; 
              }}
            >
              GET CUSTOM QUOTE
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}