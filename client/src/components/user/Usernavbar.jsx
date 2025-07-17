import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const catalogItems = [
    { name: 'Men\'s Collection', href: '/catalog/mens' },
    { name: 'Women\'s Collection', href: '/catalog/womens' },
    { name: 'Formal Wear', href: '/catalog/formal' },
    { name: 'Premium Fabrics', href: '/catalog/fabrics' }
  ];

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - Enhanced contrast and professional look */}
      <div className="bg-black border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Top Bar */}
          <div className="hidden md:flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Phone className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-300">+852 2234 5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-300">info@jmdtailors.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-300">Mon-Sat: 9AM-7PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-300">108, Business park,Dombivali</span>
              </div>
            </div>
          </div>

          {/* Mobile Top Bar */}
          <div className="md:hidden flex items-center justify-center h-9">
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-300">Mon-Sat: 9AM-7PM</span>
              </div>
              <div className="w-px h-3 bg-gray-600"></div>
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3 text-yellow-400" />
                <span className="text-gray-300">+852 2234 5678</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Section - Centered logo with social and contact */}
      <div className={`transition-all duration-300 ${
        isScrolled ? 'bg-white border-b border-gray-200 shadow-md' : 'bg-white border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left - Social Icons (Desktop) */}
            <div className="hidden lg:flex items-center space-x-4">
              <a href="#" className="text-black hover:text-yellow-500 transition-colors duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="text-black hover:text-yellow-500 transition-colors duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-black hover:text-yellow-500 transition-colors duration-200">
                <Twitter className="w-4 h-4" />
              </a>
            </div>

            {/* Center - Logo */}
            <div className="flex-1 flex justify-center lg:flex-none">
              <div className="flex items-center justify-center">
              <a href='/'>  <img 
                  src="/images/jmd_logo.jpeg" 
                  alt="JMD Logo" 
                  className="w-26 h-20  shadow-sm"
                />
                </a>
              </div>
            </div>

            {/* Right - Contact Button (Desktop) */}
            <div className="hidden lg:block">
              <button className="px-6 py-2 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-sm hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                Contact Us
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-900 hover:text-yellow-500 transition-colors duration-200 focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu Bar */}
      <div className={`transition-all duration-300 ${
        isScrolled ? 'bg-gray-50 border-b border-gray-200' : 'bg-gray-50 border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Desktop Navigation */}
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

            <a href="/services" className="relative group py-2">
              <span className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
                Services
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></div>
            </a>

            <a href="/contact" className="relative group py-2">
              <span className="text-gray-700 hover:text-yellow-600 transition-colors duration-200 text-sm font-medium tracking-wide uppercase">
                Contact
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></div>
            </a>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200">
              <div className="py-4 space-y-1">
                
                <a href="/about" className="block px-4 py-3 text-gray-700 hover:text-yellow-600 hover:bg-gray-100 transition-all duration-200 rounded-md">
                  <span className="text-sm font-medium tracking-wide uppercase">About</span>
                </a>

                {/* Mobile Collections Dropdown */}
                <div>
                  <button
                    onClick={() => handleDropdownToggle('mobileCatalog')}
                    className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-yellow-600 hover:bg-gray-100 transition-all duration-200 rounded-md focus:outline-none"
                  >
                    <span className="text-sm font-medium tracking-wide uppercase">Collections</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-all duration-200 ${
                      activeDropdown === 'mobileCatalog' ? 'rotate-180 text-yellow-600' : ''
                    }`} />
                  </button>
                  
                  {activeDropdown === 'mobileCatalog' && (
                    <div className="mt-2 ml-4 space-y-1 border-l-2 border-yellow-500 pl-4">
                      {catalogItems.map((item, index) => (
                        <a
                          key={index}
                          href={item.href}
                          className="block py-2 px-3 text-gray-600 hover:text-yellow-600 hover:bg-gray-50 transition-all duration-200 rounded-md text-sm"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <a href="/fabrics" className="block px-4 py-3 text-gray-700 hover:text-yellow-600 hover:bg-gray-100 transition-all duration-200 rounded-md">
                  <span className="text-sm font-medium tracking-wide uppercase">Fabrics</span>
                </a>

                <a href="/gallery" className="block px-4 py-3 text-gray-700 hover:text-yellow-600 hover:bg-gray-100 transition-all duration-200 rounded-md">
                  <span className="text-sm font-medium tracking-wide uppercase">Gallery</span>
                </a>

                <a href="/services" className="block px-4 py-3 text-gray-700 hover:text-yellow-600 hover:bg-gray-100 transition-all duration-200 rounded-md">
                  <span className="text-sm font-medium tracking-wide uppercase">Services</span>
                </a>

                <a href="/contact" className="block px-4 py-3 text-gray-700 hover:text-yellow-600 hover:bg-gray-100 transition-all duration-200 rounded-md">
                  <span className="text-sm font-medium tracking-wide uppercase">Contact</span>
                </a>

                {/* Mobile Social Links */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-6">
                    <a href="#" className="text-gray-600 hover:text-yellow-500 transition-colors duration-200">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-yellow-500 transition-colors duration-200">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-yellow-500 transition-colors duration-200">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Mobile Contact Button */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button className="w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium tracking-wide uppercase rounded-md hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;