import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserFooter = () => {
  const [hoveredSection, setHoveredSection] = useState(null);

  const getWhatsAppLink = () => {
    const message = encodeURIComponent(
      "Hi, I am interested in your tailoring services"
    );

    const isMobile =
      /iPhone|Android|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
        navigator.userAgent
      );

    const baseURL = isMobile
      ? `https://wa.me/917972889376?text=${message}`
      : `https://web.whatsapp.com/send?phone=917972889376&text=${message}`;

    return baseURL;
  };

  const footerSections = [
    {
      title: "About Us",
      links: [
        { to: "/about", label: "Our Story" },
        { to: "/craftmanship", label: "Craftsmanship" },
        { to: "/experience", label: "Experience" },
        { to: "/quality", label: "Quality Promise" },
        { to: "/team", label: "Meet the Team" }
      ]
    },
    {
      title: "Services",
      links: [
        { to: "/services/suits", label: "Custom Suits" },
        { to: "/services/traditional", label: "Traditional Wear" },
        { to: "/services/alterations", label: "Alterations" },
        { to: "/services/formal", label: "Formal Wear" },
        { to: "/services/casual", label: "Casual Clothing" }
      ]
    },
    {
      title: "Gallery",
      links: [
        { to: "/gallery", label: "Our Work" },
        { to: "/gallery/suits", label: "Suit Gallery" },
        { to: "/testimonials", label: "Testimonials" },
        { to: "/gallery/traditional", label: "Traditional Wear" },
        { to: "/before-after", label: "Before & After" }
      ]
    },
    {
      title: "Contact",
      links: [
        { to: "/contact", label: "Get in Touch" },
        { to: "/appointment", label: "Book Appointment" },
        { to: "/quote", label: "Get Quote" },
        { to: "/location", label: "Visit Our Shop" },
        { to: "/support", label: "Support" }
      ]
    }
  ];

  return (
    <>
      <footer className="relative">
        <div className="relative mt-10 sm:mt-14 md:mt-16 overflow-hidden">
          {/* Enhanced Wave Pattern */}
          <svg
            className="absolute top-0 w-full h-8 -mt-6 sm:-mt-12 sm:h-20 z-10"
            preserveAspectRatio="none"
            viewBox="0 0 1440 54"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="tailorGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#8B5A2B" />
                <stop offset="25%" stopColor="#b08d57" />
                <stop offset="50%" stopColor="#e3b873" />
                <stop offset="75%" stopColor="#d4a574" />
                <stop offset="100%" stopColor="#8B5A2B" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <path
              fill="url(#tailorGradient)"
              filter="url(#glow)"
              d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
            />
          </svg>

          {/* Main Footer Content */}
          <div className="relative z-20 footer-gradient">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
              
              {/* Hero Section */}
              <div className="text-center mb-16">
                <div className="inline-block p-1 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 mb-6">
                  <div className="bg-black bg-opacity-20 rounded-full px-6 py-2">
                    <span className="text-white text-sm font-semibold tracking-wide">
                      MASTER CRAFTSMANSHIP
                    </span>
                  </div>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  Need custom tailoring?
                  <br />
                  <span className="bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">
                    Let's craft perfection
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                  From bespoke suits to traditional wear, we create garments that 
                  fit you perfectly. Experience craftsmanship that's tailored to 
                  your style and measurements.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">

                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.109"/>
                    </svg>
                    WhatsApp Us
                  </a>
                </div>
              </div>

              {/* Footer Links Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
                
                {/* Brand Section */}
                <div className="lg:col-span-2 space-y-6">
                  <Link
                    to="/"
                    className="inline-flex items-center group"
                  >
                    <div className="relative">
                      <span className="text-3xl sm:text-4xl font-extrabold text-white group-hover:text-orange-300 transition-colors duration-300">
                        Master Tailor
                      </span>
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-300 to-yellow-300 group-hover:w-full transition-all duration-300"></div>
                    </div>
                  </Link>
                  
                  <p className="text-gray-200 leading-relaxed">
                    With decades of experience in traditional and modern tailoring, 
                    we create garments that reflect your personality and ensure 
                    the perfect fit. From formal wear to casual clothing, 
                    every stitch tells a story of craftsmanship.
                  </p>
                  
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 bg-opacity-20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-gray-200">+91 797 288 9376</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-500 bg-opacity-20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-gray-200">Lonavla, Maharashtra</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Sections */}
                <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                  {footerSections.map((section, index) => (
                    <div
                      key={section.title}
                      className="space-y-4"
                      onMouseEnter={() => setHoveredSection(index)}
                      onMouseLeave={() => setHoveredSection(null)}
                    >
                      <div className="relative">
                        <h3 className="font-bold text-lg text-orange-300 mb-1">
                          {section.title}
                        </h3>
                        <div className={`h-0.5 bg-gradient-to-r from-orange-300 to-yellow-300 transition-all duration-300 ${
                          hoveredSection === index ? 'w-full' : 'w-8'
                        }`}></div>
                      </div>
                      
                      <ul className="space-y-3">
                        {section.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <Link
                              to={link.to}
                              className="group inline-flex items-center text-gray-200 hover:text-orange-300 transition-all duration-300 transform hover:translate-x-1"
                            >
                              <span className="w-0 h-0.5 bg-orange-300 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                              {link.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white border-opacity-20 space-y-4 sm:space-y-0">
                <p className="text-gray-300 text-sm">
                  © Copyright 2025 Master Tailor. All rights reserved.
                </p>
                
                {/* Social Links */}
                <div className="flex items-center space-x-4">
                  {[
                    { icon: "M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z", label: "Twitter" },
                    { icon: "M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10 C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1 c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z", label: "Instagram", viewBox: "0 0 30 30" },
                    { icon: "M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z", label: "Facebook" }
                  ].map((social, index) => (
                    <Link
                      key={index}
                      to="/"
                      className="group w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-orange-500 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                    >
                      <svg
                        viewBox={social.viewBox || "0 0 24 24"}
                        fill="currentColor"
                        className="w-5 h-5 text-white group-hover:text-white transition-colors duration-300"
                      >
                        <path d={social.icon} />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="floating-buttons-wrapper">
          <a
            href="tel:+917972889376"
            className="floating-btn phone-btn group"
            aria-label="Call us"
          >
            <svg
              fill="white"
              viewBox="0 0 24 24"
              className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
            >
              <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
            </svg>
          </a>
          
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="floating-btn whatsapp-btn group"
            aria-label="WhatsApp"
          >
            <svg
              fill="white"
              viewBox="0 0 24 24"
              className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.109"/>
            </svg>
          </a>
        </div>
      </footer>

      <style jsx>{`
        .footer-gradient {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d1810 25%, #3d2817 50%, #2d1810 75%, #1a1a1a 100%);
          position: relative;
        }
        
        .footer-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #8B5A2B 0%, #b08d57 25%, #e3b873 50%, #d4a574 75%, #8B5A2B 100%);
          opacity: 0.1;
          z-index: 1;
        }
        
        .footer-gradient > * {
          position: relative;
          z-index: 2;
        }
        
        .floating-buttons-wrapper {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .floating-btn {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          position: relative;
          overflow: hidden;
        }
        
        .floating-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transition: all 0.6s ease;
          transform: translate(-50%, -50%);
        }
        
        .floating-btn:hover {
          transform: translateY(-5px) scale(1.1);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }
        
        .floating-btn:hover::before {
          width: 120px;
          height: 120px;
        }
        
        .phone-btn {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        }
        
        .whatsapp-btn {
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
        }
        
        .floating-btn:active {
          transform: translateY(-2px) scale(1.05);
        }
        
        @media (max-width: 768px) {
          .floating-buttons-wrapper {
            bottom: 20px;
            right: 20px;
          }
          
          .floating-btn {
            width: 60px;
            height: 60px;
          }
        }
        
        @media (max-width: 640px) {
          .footer-gradient {
            border-radius: 0 !important;
          }
          
          .floating-buttons-wrapper {
            gap: 15px;
          }
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
        
        .floating-btn:hover {
          animation: pulse 2s infinite;
        }
      `}</style>
    </>
  );
};

export default UserFooter;