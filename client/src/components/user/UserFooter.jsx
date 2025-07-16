import React from "react";
import { Link } from "react-router-dom";

const UserFooter = () => {
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

  return (
    <>
      <section className="px-2 sm:px-4 md:px-8">
        <div className="relative mt-10 sm:mt-14 md:mt-16 dark-footer-gradient rounded-none">
          <svg
            className="absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16"
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
                <stop offset="0%" stopColor="#b08d57" />
                <stop offset="50%" stopColor="#e3b873" />
                <stop offset="100%" stopColor="#8B5A2B" />
              </linearGradient>
            </defs>
            <path
              fill="url(#tailorGradient)"
              d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z"
            />
          </svg>

          <div className="w-full py-6 sm:py-8 md:py-10 flex items-center justify-center dark-footer-gradient">
            <div className="container w-full px-0 sm:px-4 text-white flex flex-col">
              <div className="w-full text-3xl sm:text-5xl md:text-7xl font-bold">
                <h1 className="w-full md:w-2/3 text-2xl sm:text-4xl md:text-6xl">
                  Need custom tailoring? Let's craft perfection
                </h1>
              </div>
              <div className="flex mt-6 sm:mt-8 flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
                <p className="w-full md:w-2/3 text-white text-base sm:text-lg">
                  From bespoke suits to traditional wear, we create garments that 
                  fit you perfectly. Experience craftsmanship that's tailored to 
                  your style and measurements.
                </p>
               
              </div>

              <div className="pt-8 sm:pt-12 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl">
                <div className="grid gap-8 sm:gap-12 md:gap-16 row-gap-8 sm:row-gap-10 mb-8 lg:grid-cols-6">
                  <div className="md:max-w-md lg:col-span-2 mb-8 lg:mb-0">
                    <Link
                      to="/"
                      aria-label="Go home"
                      title="Master Tailor"
                      className="inline-flex items-center"
                    >
                      <span className="text-4xl font-extrabold text-white">
                        Master Tailor
                      </span>
                    </Link>

                    <div className="mt-4 lg:max-w-sm">
                      <p className="mt-4 text-sm text-gray-200">
                        With decades of experience in traditional and modern tailoring, 
                        we create garments that reflect your personality and ensure 
                        the perfect fit. From formal wear to casual clothing, 
                        every stitch tells a story of craftsmanship.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:gap-5 row-gap-6 sm:row-gap-8 lg:col-span-4 md:grid-cols-4">
                    <div>
                      <p className="font-semibold tracking-wide text-orange-300">
                        About Us
                      </p>
                      <ul className="mt-2 space-y-2 cursor-pointer">
                        <li>
                          <Link
                            to="/about"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Our Story
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/craftmanship"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Craftsmanship
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/experience"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Experience
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/quality"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Quality Promise
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/team"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Meet the Team
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold tracking-wide text-orange-300">
                        Services
                      </p>
                      <ul className="mt-2 space-y-2">
                        <li>
                          <Link
                            to="/services/suits"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Custom Suits
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/services/traditional"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Traditional Wear
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/services/alterations"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Alterations
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/services/formal"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Formal Wear
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/services/casual"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Casual Clothing
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold tracking-wide text-orange-300">
                        Gallery
                      </p>
                      <ul className="mt-2 space-y-2">
                        <li>
                          <Link
                            to="/gallery"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Our Work
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/gallery/suits"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Suit Gallery
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/testimonials"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Testimonials
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/gallery/traditional"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Traditional Wear
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/before-after"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Before & After
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold tracking-wide text-orange-300">
                        Contact
                      </p>
                      <ul className="mt-2 space-y-2">
                        <li>
                          <Link
                            to="/contact"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Get in Touch
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/appointment"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Book Appointment
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/quote"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Get Quote
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/location"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Visit Our Shop
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/support"
                            className="transition-colors duration-300 text-deep-purple-50 hover:text-orange-300"
                          >
                            Support
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between pt-4 sm:pt-5 pb-0 border-t border-deep-purple-accent-200 sm:flex-row gap-2 sm:gap-0">
                  <p className="text-xs sm:text-sm text-center text-gray-100">
                    © Copyright 2025 Master Tailor. All rights reserved.
                  </p>
                  <div className="flex items-center justify-center mt-2 sm:mt-4 space-x-3 sm:space-x-4">
                    <Link
                      to="/"
                      className="transition-colors duration-300 text-deep-purple-100 hover:text-orange-300"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5"
                      >
                        <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z" />
                      </svg>
                    </Link>
                    <Link
                      to="/"
                      className="transition-colors duration-300 text-deep-purple-100 hover:text-orange-300"
                    >
                      <svg
                        viewBox="0 0 30 30"
                        fill="currentColor"
                        className="h-6"
                      >
                        <circle cx="15" cy="15" r="4" />
                        <path d="M19.999,3h-10C6.14,3,3,6.141,3,10.001v10C3,23.86,6.141,27,10.001,27h10C23.86,27,27,23.859,27,19.999v-10   C27,6.14,23.859,3,19.999,3z M15,21c-3.309,0-6-2.691-6-6s2.691-6,6-6s6,2.691,6,6S18.309,21,15,21z M22,9c-0.552,0-1-0.448-1-1   c0-0.552,0.448-1,1-1s1,0.448,1,1C23,8.552,22.552,9,22,9z" />
                      </svg>
                    </Link>
                    <Link
                      to="/"
                      className="transition-colors duration-300 text-deep-purple-100 hover:text-orange-300"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5"
                      >
                        <path d="M22,0H2C0.895,0,0,0.895,0,2v20c0,1.105,0.895,2,2,2h11v-9h-3v-4h3V8.413c0-3.1,1.893-4.788,4.659-4.788 c1.325,0,2.463,0.099,2.795,0.143v3.24l-1.918,0.001c-1.504,0-1.795,0.715-1.795,1.763V11h4.44l-1,4h-3.44v9H22c1.105,0,2-0.895,2-2 V2C24,0.895,23.105,0,22,0z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dark-footer-gradient {
          background: linear-gradient(135deg, #b08d57 0%, #e3b873 50%, #8B5A2B 100%);
        }
        
        .floating-buttons-wrapper {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .floating-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .floating-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }
        
        .phone-wave {
          background: linear-gradient(135deg, #007bff, #0056b3);
        }
        
        .green-wave {
          background: linear-gradient(135deg, #25D366, #128C7E);
        }
        
        .floating-btn svg {
          width: 30px;
          height: 30px;
          z-index: 2;
        }
        
        .floating-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transition: all 0.6s ease;
          transform: translate(-50%, -50%);
        }
        
        .floating-btn:hover::before {
          width: 100px;
          height: 100px;
        }
        
        @media (max-width: 768px) {
          .floating-buttons-wrapper {
            bottom: 15px;
            right: 15px;
          }
          
          .floating-btn {
            width: 50px;
            height: 50px;
          }
          
          .floating-btn svg {
            width: 25px;
            height: 25px;
          }
        }
        @media (max-width: 640px) {
          .dark-footer-gradient {
            border-radius: 0 !important;
          }
        }
      `}</style>
    </>
  );
};

export default UserFooter;