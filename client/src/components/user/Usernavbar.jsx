import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Phone, Mail, MapPin, Clock } from 'lucide-react';

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowTopBar(window.scrollY < 100);
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
      {/* Elegant Top Bar - Fixed positioning issue */}
      <div className={`absolute top-0 left-0 right-0 transition-all duration-300 ${
        showTopBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      } ${showTopBar ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className="bg-gradient-to-r from-amber-100/20 via-black/90 to-amber-100/20 text-white border-b border-amber-200/20">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            {/* Desktop Top Bar */}
            <div className="hidden sm:flex items-center justify-between h-10 text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span className="text-white/80 font-light">+852 2234 5678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3 h-3 text-amber-400" />
                  <span className="text-white/80 font-light">info@kripalanistailor.com</span>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span className="text-white/80 font-light">Mon-Sat: 9AM-7PM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span className="text-white/80 font-light">Central, Hong Kong</span>
                </div>
              </div>
            </div>

            {/* Mobile Top Bar */}
            <div className="sm:hidden flex items-center justify-center h-8">
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  
                  <span className="text-white/80 font-light">"Your Satisfaction is Our Priority"</span>
                </div>
                <div className="w-px h-3 bg-white/20"></div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span className="text-white/80 font-light">Mon-Sat: 9AM-7PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation - Fixed positioning */}
      <nav className={`relative transition-all duration-500 ${
        showTopBar ? 'mt-10 sm:mt-10' : 'mt-0'
      } ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-md shadow-2xl border-b border-amber-200/20' 
          : 'bg-gradient-to-b from-black/60 via-black/40 to-transparent'
      }`}>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-16">
            
            {/* Optimized Logo Section - Mobile Enhanced */}
            <div className="flex items-center">
              <div className="relative group">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-amber-200 rounded-full blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                
                {/* Main logo container - Responsive sizing */}
                <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg border border-amber-200/30 bg-gradient-to-br from-amber-100 to-amber-200">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center overflow-hidden">
                    <div className="w-7 h-7 sm:w-9 sm:h-9 bg-amber-200 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center">
                       <img src="/images/jmd_logo.jpeg" alt="logo" className="w-6 h-6 sm:w-8 sm:h-8 lg:w-15 lg:h-15 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Brand text - Mobile optimized */}
              <div className="ml-2 sm:ml-3">
                <div className="text-lg sm:text-xl font-bold tracking-wide leading-tight text-amber-100">
                  JMD
                </div>
                <div className="text-white/70 text-xs font-light tracking-widest uppercase leading-tight">
                  Premium Tailors
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-10">
              <a href="/about" className="relative group py-2">
                <span className="text-white/90 hover:text-amber-400 transition-colors duration-300 text-sm font-medium tracking-wide uppercase">
                  About
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full"></div>
              </a>

              {/* Catalog Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => handleDropdownToggle('catalog')}
                  className="flex items-center space-x-1 py-2 focus:outline-none"
                >
                  <span className="text-white/90 hover:text-amber-400 transition-colors duration-300 text-sm font-medium tracking-wide uppercase">
                    Collections
                  </span>
                  <ChevronDown className={`w-4 h-4 text-white/70 transition-all duration-300 ${
                    activeDropdown === 'catalog' ? 'rotate-180 text-amber-400' : 'group-hover:text-amber-400'
                  }`} />
                </button>
                
                {activeDropdown === 'catalog' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-md rounded-lg shadow-2xl border border-amber-400/20 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {catalogItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className="block px-6 py-3 text-white/80 hover:text-amber-400 hover:bg-amber-400/5 transition-all duration-200 border-b border-white/5 last:border-b-0"
                      >
                        <span className="text-sm font-light tracking-wide">
                          {item.name}
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a href="/fabrics" className="relative group py-2">
                <span className="text-white/90 hover:text-amber-400 transition-colors duration-300 text-sm font-medium tracking-wide uppercase">
                  Fabrics
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full"></div>
              </a>

              <a href="/gallery" className="relative group py-2">
                <span className="text-white/90 hover:text-amber-400 transition-colors duration-300 text-sm font-medium tracking-wide uppercase">
                  Gallery
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full"></div>
              </a>

              <a href="/contact" className="relative group py-2">
                <span className="text-white/90 hover:text-amber-400 transition-colors duration-300 text-sm font-medium tracking-wide uppercase">
                  Contact
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full"></div>
              </a>
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden lg:block">
              <button
                type="button"
                className="relative group px-6 py-3 text-black font-semibold text-sm tracking-wide uppercase rounded-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black overflow-hidden bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 border-2 border-amber-300 shadow-lg hover:shadow-amber-200/25"
              >
                <span className="relative z-10">Book Now</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white/80 hover:text-amber-400 transition-colors duration-200 focus:outline-none rounded-md hover:bg-white/5"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation - Enhanced Professional Design */}
          {isMenuOpen && (
            <div className="lg:hidden animate-in slide-in-from-top duration-300 ease-out">
              <div className="bg-black/95 backdrop-blur-md border-t border-amber-400/20 rounded-b-lg shadow-2xl">
                <div className="px-4 py-6 space-y-1">
                  
                  {/* Mobile Menu Items */}
                  <a href="/about" className="block group">
                    <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-amber-400/5 transition-all duration-200">
                      <span className="text-white/90 group-hover:text-amber-400 transition-colors duration-200 text-base font-medium tracking-wide uppercase">
                        About
                      </span>
                      <div className="w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
                    </div>
                  </a>

                  {/* Mobile Collections Dropdown */}
                  <div className="block group">
                    <button
                      onClick={() => handleDropdownToggle('mobileCatalog')}
                      className="flex items-center justify-between w-full py-3 px-4 rounded-lg hover:bg-amber-400/5 transition-all duration-200 focus:outline-none"
                    >
                      <span className="text-white/90 group-hover:text-amber-400 transition-colors duration-200 text-base font-medium tracking-wide uppercase">
                        Collections
                      </span>
                      <ChevronDown className={`w-4 h-4 text-white/70 transition-all duration-200 ${
                        activeDropdown === 'mobileCatalog' ? 'rotate-180 text-amber-400' : 'group-hover:text-amber-400'
                      }`} />
                    </button>
                    
                    {activeDropdown === 'mobileCatalog' && (
                      <div className="mt-2 ml-4 space-y-1 border-l-2 border-amber-400/30 pl-4 animate-in fade-in slide-in-from-left-1 duration-200">
                        {catalogItems.map((item, index) => (
                          <a
                            key={index}
                            href={item.href}
                            className="block py-2 px-3 text-white/70 hover:text-amber-400 hover:bg-amber-400/5 transition-all duration-200 rounded-md"
                          >
                            <span className="text-sm font-light tracking-wide">
                              {item.name}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <a href="/fabrics" className="block group">
                    <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-amber-400/5 transition-all duration-200">
                      <span className="text-white/90 group-hover:text-amber-400 transition-colors duration-200 text-base font-medium tracking-wide uppercase">
                        Fabrics
                      </span>
                      <div className="w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
                    </div>
                  </a>

                  <a href="/gallery" className="block group">
                    <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-amber-400/5 transition-all duration-200">
                      <span className="text-white/90 group-hover:text-amber-400 transition-colors duration-200 text-base font-medium tracking-wide uppercase">
                        Gallery
                      </span>
                      <div className="w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
                    </div>
                  </a>

                  <a href="/contact" className="block group">
                    <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-amber-400/5 transition-all duration-200">
                      <span className="text-white/90 group-hover:text-amber-400 transition-colors duration-200 text-base font-medium tracking-wide uppercase">
                        Contact
                      </span>
                      <div className="w-2 h-2 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"></div>
                    </div>
                  </a>

                  {/* Mobile CTA Button */}
                  <div className="pt-4 mt-4 border-t border-amber-400/20">
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-amber-100 to-amber-200 text-black font-semibold text-sm tracking-wide uppercase rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-200/25 focus:outline-none focus:ring-2 focus:ring-amber-200 active:scale-95">
                      Book Now
                    </button>
                  </div>

                  {/* Mobile Contact Info */}
                  <div className="pt-4 mt-4 border-t border-amber-400/20">
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="flex items-center space-x-2 text-white/60">
                        <Mail className="w-3 h-3 text-amber-400" />
                        <span>info@kripalanistailor.com</span>
                      </div>
                      <div className="flex items-center space-x-2 text-white/60">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>Central, Hong Kong</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default UserNavbar;