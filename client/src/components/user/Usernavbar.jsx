import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const catalogItems = [
    { name: "Men's Collection", href: "/catalog/mens" },
    { name: "Women's Collection", href: "/catalog/womens" },
    { name: "Formal Wear", href: "/catalog/formal" },
    { name: "Premium Fabrics", href: "/catalog/fabrics" },
  ];

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - Enhanced contrast and professional look */}
      <div className="bg-black border-b border-gray-700">
        <div className="  mx-autopx-4 sm:px-8 md:px-12 lg:px-20 xl:px-40"></div>
      </div>

      {/* Logo Section - Centered logo with social and contact */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-white border-b border-gray-200 shadow-md"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className=" mx-auto px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40">
          <div className="flex items-center justify-between h-20">
            {/* Left - Social Icons (Desktop) */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Center - Logo */}
              <div className="absolute left-1/2 transform -translate-x-1/2 lg:relative lg:left-auto lg:transform-none lg:flex-1 lg:flex  lg:flex-none">
                <div className="flex items-center">
                  <a href="/">
                    {" "}
                    <img
                      src="/images/jmd_logo.jpeg"
                      alt="JMD Logo"
                      className="w-26 h-20  shadow-sm"
                    />
                  </a>
                </div>
              </div>

              {/* <a href="https://www.instagram.com/jmdstitching.co.in/" className="text-black hover:text-yellow-500 transition-colors duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/jmdstitching.co.in/" className="text-black hover:text-yellow-500 transition-colors duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.instagram.com/jmdstitching.co.in/" className="text-black hover:text-yellow-500 transition-colors duration-200">
                <Twitter className="w-4 h-4" />
              </a> */}
            </div>

            <div className="hidden lg:flex items-center justify-center space-x-12 h-14">
              <a href="/about" className="relative group py-2">
                <span className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
                  About
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a href="/men" className="relative group py-2">
                <span className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
                  Men
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a href="/women" className="relative group py-2">
                <span className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
                  Women
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></div>
              </a>

              {/* Collections Dropdown */}
              {/* <div className="relative group">
              <button
                onClick={() => handleDropdownToggle('catalog')}
                className="flex items-center space-x-1 py-2 focus:outline-none group"
              >
                <span className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
                  Collections
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-all duration-200 ${
                  activeDropdown === 'catalog' ? 'rotate-180 text-yellow-600' : 'group-hover:text-yellow-600'
                }`} />
              </button>
              
              {activeDropdown === 'catalog' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {catalogItems.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="block px-6 py-3 text-gray-700 hover:text-yellow-600 hover:bg-gray-50 transition-all duration-200 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div> */}

              <a href="/fabrics" className="relative group py-2">
                <span className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
                  Fabrics
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></div>
              </a>

              <a href="/gallery" className="relative group py-2">
                <span className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
                  Gallery
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></div>
              </a>

              {/* <a href="/services" className="relative group py-2">
              <span className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
                Services
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></div>
            </a> */}

              <a href="/catalogues" className="relative group py-2">
                <span className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
                  Catalogues
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></div>
              </a>

              <a href="/track-order" className="relative group py-2">
                <span className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
                  Track Order
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></div>
              </a>

              {/* <a href="/contact" className="relative group py-2">
              <span className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
                Contact
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></div>
            </a> */}
            </div>

            {/* Center - Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 lg:relative lg:left-auto lg:transform-none lg:flex-1 lg:flex  lg:flex-none lg:hidden">
              <div className="flex items-center">
                <a href="/">
                  {" "}
                  <img
                    src="/images/jmd_logo.jpeg"
                    alt="JMD Logo"
                    className="w-26 h-20  shadow-sm"
                  />
                </a>
              </div>
            </div>

            {/* Right - Contact Button (Desktop) */}
            <div className="hidden lg:block">
              <a
                href="/contact"
                className="border-2 px-6 py-2.5 text-sm font-serif tracking-wider shadow-md transition-all duration-300 uppercase"
                style={{
                  borderRadius: 0,
                  background: "#e3b873",
                  color: "#222",
                  borderColor: "#e3b873",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#222";
                  e.currentTarget.style.color = "#e3b873";
                  e.currentTarget.style.borderColor = "#222";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#e3b873";
                  e.currentTarget.style.color = "#222";
                  e.currentTarget.style.borderColor = "#e3b873";
                }}
              >
                Contact Us
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-900 hover:text-yellow-500 transition-colors duration-200 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu Bar */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-gray-50 border-b border-gray-200"
            : "bg-gray-50 border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Desktop Navigation */}

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t h-screen  border-amber-200/50 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-3 space-y-1">
              <a
                href="/about"
                className="block px-4 py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-100/50 transition-all duration-300 rounded-lg mx-2"
              >
                <span className="text-sm font-medium tracking-wider uppercase font-serif">
                  About
                </span>
              </a>

              <a
                href="/men"
                className="block px-4 py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-100/50 transition-all duration-300 rounded-lg mx-2"
              >
                <span className="text-sm font-medium tracking-wider uppercase font-serif">
                  Men
                </span>
              </a>

              <a
                href="/women"
                className="block px-4 py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-100/50 transition-all duration-300 rounded-lg mx-2"
              >
                <span className="text-sm font-medium tracking-wider uppercase font-serif">
                  Women
                </span>
              </a>

              <a
                href="/fabrics"
                className="block px-4 py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-100/50 transition-all duration-300 rounded-lg mx-2"
              >
                <span className="text-sm font-medium tracking-wider uppercase font-serif">
                  Fabrics
                </span>
              </a>

              {/* <a href="/services" className="block px-4 py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-100/50 transition-all duration-300 rounded-lg mx-2">
                <span className="text-sm font-medium tracking-wider uppercase font-serif">Services</span>
              </a> */}

              <a
                href="/gallery"
                className="block px-4 py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-100/50 transition-all duration-300 rounded-lg mx-2"
              >
                <span className="text-sm font-medium tracking-wider uppercase font-serif">
                  Gallery
                </span>
              </a>

              <a
                href="/catalogues"
                className="block px-4 py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-100/50 transition-all duration-300 rounded-lg mx-2"
              >
                <span className="text-sm font-medium tracking-wider uppercase font-serif">
                  Catalogues
                </span>
              </a>

              <a
                href="/track-order"
                className="block px-4 py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-100/50 transition-all duration-300 rounded-lg mx-2"
              >
                <span className="text-sm font-medium tracking-wider uppercase font-serif">
                  Track Order
                </span>
              </a>

              {/* <a href="/custom-tailoring" className="block px-4 py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-100/50 transition-all duration-300 rounded-lg mx-2">
                <span className="text-sm font-medium tracking-wider uppercase font-serif">Custom Tailoring</span>
              </a> */}
              {/* 
              <a href="/contact" className="block px-4 py-2.5 text-gray-700 hover:text-amber-600 hover:bg-amber-100/50 transition-all duration-300 rounded-lg mx-2">
                <span className="text-sm font-medium tracking-wider uppercase font-serif">Contact</span>
              </a> */}

              {/* Mobile Social Links */}
              {/* <div className="pt-3 mt-3 border-t border-amber-200/50">
                <div className="flex items-center justify-center space-x-6">
                  <a href="https://www.instagram.com/jmdstitching.co.in/" className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-100 transition-all duration-300 rounded-full">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://www.instagram.com/jmdstitching.co.in/" className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-100 transition-all duration-300 rounded-full">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://www.instagram.com/jmdstitching.co.in/" className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-100 transition-all duration-300 rounded-full">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div> */}

              {/* Mobile Contact Button */}
              <div className="pt-3 mt-3 border-amber-200/50 px-4">
                <a
                  href="/contact"
                  className="w-full border-2 px-4 py-3 text-sm font-serif tracking-wider shadow-md transition-all duration-300 uppercase"
                  style={{
                    borderRadius: 0,
                    background: "#e3b873",
                    color: "#222",
                    borderColor: "#e3b873",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#222";
                    e.currentTarget.style.color = "#e3b873";
                    e.currentTarget.style.borderColor = "#222";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#e3b873";
                    e.currentTarget.style.color = "#222";
                    e.currentTarget.style.borderColor = "#e3b873";
                  }}
                >
                  Contact Us
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
