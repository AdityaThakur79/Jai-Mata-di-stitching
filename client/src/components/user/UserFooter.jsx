import React from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  ArrowUp,
  Youtube
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

const footerLinks = {
  company: [
    { to: "/about", label: "About Us" },
    { to: "/services", label: "Services" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
  ],
  services: [
    { to: "/men", label: "Men's Wear" },
    { to: "/women", label: "Women's Wear" },
    { to: "/fabrics", label: "Premium Fabrics" },
    { to: "/custom-tailoring", label: "Custom Tailoring" },
  ],
  legal: [
    { to: "/terms", label: "Terms & Conditions" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/refund", label: "Refund Policy" },
    { to: "/shipping", label: "Shipping Policy" },
  ]
};

const socialLinks = [
  { icon: <Facebook className="w-5 h-5" />, href: "https://www.facebook.com/jmdstitching", label: "Facebook" },
  { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/jmdstitching.co.in/", label: "Instagram" },
  { icon: <FaXTwitter className="w-5 h-5" />, href: "https://x.com/JmdStitching", label: "Twitter" },
  { icon: <Linkedin className="w-5 h-5" />, href: "linkedin.com/company/jmd-stitching-private-limited/", label: "LinkedIn" },
  { icon: <Youtube className="w-5 h-5" />, href: "https://www.youtube.com/@jmdstitching", label: "Youtube" },
];

const UserFooter = () => {
  const scrollToTop = () => {
    if (window.lenisScrollToTop) {
      window.lenisScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="relative overflow-hidden">
      {/* Enhanced Background matching MenHeroSection */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-amber-100/30 via-orange-50/20 to-transparent"></div>
      
      {/* Subtle overlay pattern matching hero section */}
      <div 
        className="absolute inset-0 opacity-12"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(227, 184, 115, 0.08) 100px, transparent 100px),
            radial-gradient(circle at 80% 80%, rgba(227, 184, 115, 0.06) 120px, transparent 120px),
            radial-gradient(circle at 40% 60%, rgba(227, 184, 115, 0.05) 80px, transparent 80px)
          `,
        }}
      ></div>
      
      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-white/15 backdrop-blur-sm"></div>
      
      {/* Decorative elements matching hero section */}
      <div 
        className="absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(227, 184, 115, 0.25) 0%, transparent 70%)' }}
      ></div>
      <div 
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-18"
        style={{ background: 'radial-gradient(circle, rgba(227, 184, 115, 0.20) 0%, transparent 70%)' }}
      ></div>
      
      {/* Gold thread accent */}
      <svg className="absolute top-4 left-4 w-16 h-16 sm:w-24 sm:h-24 opacity-40 animate-spin-slow" viewBox="0 0 100 100" fill="none">
        <path d="M10 90 Q50 10 90 90" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
        <path d="M10 90 Q50 10 90 90" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      
      {/* Floating sparkle */}
      <svg className="absolute bottom-4 right-4 w-8 h-8 opacity-50 animate-pulse" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="8" fill="#ffffff" fillOpacity="0.2"/>
        <circle cx="16" cy="16" r="4" fill="#fbbf24" fillOpacity="0.8"/>
      </svg>
      
      {/* Enhanced Wave Pattern */}
      {/* <svg
        className="absolute top-0 w-full h-12 sm:h-16 md:h-20 -mt-6 sm:-mt-8 md:-mt-10 z-10"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="25%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#fed7aa" />
            <stop offset="75%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
          <filter id="waveGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          fill="url(#waveGradient)"
          filter="url(#waveGlow)"
          d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,0 L0,0 Z"
        />
        <path
          fill="url(#waveGradient)"
          opacity="0.5"
          d="M0,60 C360,100 720,20 1080,60 C1200,70 1320,50 1440,60 L1440,0 L0,0 Z"
        />
      </svg> */}

      {/* Main Footer Content */}
      <div className="relative z-20 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Section - Brand & Description */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full  flex items-center justify-center p-2">
                  <img src="/images/jmd_logo.jpeg" alt="JMD Logo" className="w-full h-full rounded-full object-cover" />
                </div>
                <div className="absolute inset-0 rounded-full  animate-pulse"></div>
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-light text-gray-800 mb-4 font-serif drop-shadow-sm">
              JMD STITCHING PRIVATE LIMITED
            </h2>
            <div className="w-24 h-1 mx-auto mb-6 rounded-full shadow-lg" style={{ background: '#e3b873' }}></div>
            <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto text-lg font-light drop-shadow-sm">
              Crafting excellence since 2023. Where tradition meets innovation, and every stitch tells a story of precision, care, and timeless elegance.
            </p>
          </motion.div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16 place-items-center text-center">
            
            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-medium text-gray-800 mb-6 font-serif drop-shadow-sm">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.to}>
                    <a
                      href={link.to}
                      className="text-gray-600 hover:text-gray-800 transition-all duration-300 font-medium hover:translate-x-1 inline-block drop-shadow-sm relative group"
                      style={{ '--hover-color': '#e3b873' }}
                    >
                      {link.label}
                      <span 
                        className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                        style={{ background: '#e3b873' }}
                      ></span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-medium text-gray-800 mb-6 font-serif drop-shadow-sm">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.to}>
                    <a
                      href={link.to}
                      className="text-gray-600 hover:text-gray-800 transition-all duration-300 font-medium hover:translate-x-1 inline-block drop-shadow-sm relative group"
                    >
                      {link.label}
                      <span 
                        className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                        style={{ background: '#e3b873' }}
                      ></span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-medium text-gray-800 mb-6 font-serif drop-shadow-sm">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.to}>
                    <a
                      href={link.to}
                      className="text-gray-600 hover:text-gray-800 transition-all duration-300 font-medium hover:translate-x-1 inline-block drop-shadow-sm relative group"
                    >
                      {link.label}
                      <span 
                        className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                        style={{ background: '#e3b873' }}
                      ></span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-medium text-gray-800 mb-6 font-serif drop-shadow-sm">Get in Touch</h3>
              <div className="space-y-4">
                                  <div className="flex items-start space-x-3 group">
                    <div 
                      className="p-2 backdrop-blur-sm rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
                      style={{ 
                        background: 'rgba(227, 184, 115, 0.15)',
                        border: '1px solid rgba(227, 184, 115, 0.3)'
                      }}
                    >
                      <Phone className="w-4 h-4" style={{ color: '#e3b873' }} />
                    </div>
                    <div>
                      <a 
                        href="tel:+919082150556" 
                        className="text-gray-600 hover:text-gray-800 font-medium transition-all duration-300 drop-shadow-sm relative group"
                      >
                        +91 9082150556
                        <span 
                          className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                          style={{ background: '#e3b873' }}
                        ></span>
                      </a>
                    </div>
                  </div>
                
                                  <div className="flex items-start space-x-3 group">
                    <div 
                      className="p-2 backdrop-blur-sm rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
                      style={{ 
                        background: 'rgba(227, 184, 115, 0.15)',
                        border: '1px solid rgba(227, 184, 115, 0.3)'
                      }}
                    >
                      <Mail className="w-4 h-4" style={{ color: '#e3b873' }} />
                    </div>
                    <div>
                      <a 
                        href="mailto:info@jmdstithing.com" 
                        className="text-gray-600 hover:text-gray-800 font-medium transition-all duration-300 drop-shadow-sm relative group"
                      >
                        info@jmdstithing.com
                        <span 
                          className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                          style={{ background: '#e3b873' }}
                        ></span>
                      </a>
                    </div>
                  </div>
                
                                  <div className="flex items-start space-x-3 group">
                    <div 
                      className="p-2 backdrop-blur-sm rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300"
                      style={{ 
                        background: 'rgba(227, 184, 115, 0.15)',
                        border: '1px solid rgba(227, 184, 115, 0.3)'
                      }}
                    >
                      <MapPin className="w-4 h-4" style={{ color: '#e3b873' }} />
                    </div>
                    <div>
                      <a 
                        href="https://maps.google.com/?q=108,+Infinity+Business+Park,+Dombivali+East,+Maharashtra" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800 font-medium text-sm leading-relaxed transition-all duration-300 drop-shadow-sm relative group"
                      >
                        108, Infinity Business Park<br />
                        Dombivali East, Maharashtra
                        <span 
                          className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                          style={{ background: '#e3b873' }}
                        ></span>
                      </a>
                    </div>
                  </div>
              </div>
            </motion.div>
            
          </div>

          {/* Social Media & Newsletter */}
          <motion.div 
            className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Social Links */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <h4 className="text-gray-800 font-medium drop-shadow-sm">Follow Us:</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    className="w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-110 shadow-md"
                    style={{ 
                      background: 'rgba(227, 184, 115, 0.15)',
                      border: '1px solid rgba(227, 184, 115, 0.3)'
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-gray-800 font-medium whitespace-nowrap drop-shadow-sm">Stay Updated:</span>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 backdrop-blur-sm rounded-l-lg focus:outline-none focus:ring-2 text-gray-700 placeholder-gray-500"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(227, 184, 115, 0.3)',
                    '--tw-ring-color': '#e3b873'
                  }}
                />
                <button 
                  className="px-6 py-2 text-white rounded-r-lg hover:opacity-90 transition-all duration-300 font-medium shadow-lg"
                  style={{ background: '#e3b873' }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent mb-8 shadow-lg"></div>

          {/* Bottom Bar */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center md:flex-row flex-col space-x-2 text-gray-600 text-sm drop-shadow-sm">
              <span>© 2025 JMD STITCHING PRIVATE LIMITED. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>in India</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <p className="text-gray-600 text-sm drop-shadow-sm">
                Designed by{' '}
                <a
                  href="https://servora.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-gray-600 font-medium transition-all duration-200 relative group"
                >
                  Servora
                  <span 
                    className="absolute left-0 bottom-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ background: '#e3b873' }}
                  ></span>
                </a>
              </p>
              
              {/* Scroll to Top Button */}
              <button
                onClick={scrollToTop}
                className="w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-300 hover:scale-110 shadow-md"
                style={{ 
                  background: 'rgba(227, 184, 115, 0.15)',
                  border: '1px solid rgba(227, 184, 115, 0.3)'
                }}
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        .animate-spin-slow { 
          animation: spin 12s linear infinite; 
        }
        @keyframes spin { 
          100% { transform: rotate(360deg); } 
        }
      `}</style>
    </footer>
  );
};

export default UserFooter;