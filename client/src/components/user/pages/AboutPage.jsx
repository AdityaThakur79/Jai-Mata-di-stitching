import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Handshake, Palette, Clock, Star, Leaf, Home, Users, ShieldCheck, Gem, Smile, UserCheck, Lock, Sparkles, Trophy, Shirt, Ruler, Scissors, PackageCheck, User, Globe2, HandshakeIcon } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { BlurFade } from '@/components/magicui/blur-fade';
import CTA from '../CTA';

// SVG icons for services
const ServiceIcons = {
  menswear: (
    <svg className="w-8 h-8 mx-auto text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v2l-8 4-8-4V4zm0 2v14h16V6M4 6l8 4 8-4" /></svg>
  ),
  womenswear: (
    <svg className="w-8 h-8 mx-auto text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l4 7H8l4-7zm0 0v20" /><circle cx="12" cy="17" r="5" /></svg>
  ),
  wedding: (
    <svg className="w-8 h-8 mx-auto text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7" /><path d="M5 21h14v-2a7 7 0 00-14 0v2z" /></svg>
  ),
  alterations: (
    <svg className="w-8 h-8 mx-auto text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19.5 6.5l-12 12M6.5 19.5l12-12" /><circle cx="12" cy="12" r="10" /></svg>
  ),
  bulk: (
    <svg className="w-8 h-8 mx-auto text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>
  ),
};

const JMDTailorsAbout = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Rajesh Kumar",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      text: "JMD Tailors transformed my wedding sherwanis into masterpieces. The attention to detail and craftsmanship is unmatched.",
      occasion: "Wedding Collection"
    },
    {
      name: "Priya Sharma",
      image: "https://images.unsplash.com/photo-1494790108755-2616b669ad31?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      text: "Their custom lehengas are absolutely stunning. The fit is perfect and the embroidery work is exceptional.",
      occasion: "Festive Wear"
    },
    {
      name: "Amit Patel",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
      text: "Professional suits tailored to perfection. JMD Tailors understands the importance of a perfect fit for business attire.",
      occasion: "Corporate Wear"
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 mb-8 sm:mb-12">
      <div className="relative h-[40vh] md:h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
        {/* Background Image as Header */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
             backgroundImage: `url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')` // Appealing tailor image
          }}
        />
        {/* Enhanced Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-amber-900/20" />
        
        {/* Breadcrumbs - Better positioning */}
        <nav className="absolute top-6 md:top-8 left-1/2 -translate-x-1/2 z-20" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm md:text-base backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full">
            <li>
              <a href="/" className="text-white/80 hover:text-amber-300 transition-colors duration-300">Home</a>
            </li>
            <li className="text-white/60">/</li>
            <li className="text-amber-200 font-semibold">Who We Are</li>
          </ol>
        </nav>
        
        {/* Header Content */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl  font-light text-white mb-4 md:mb-6 font-serif leading-tight drop-shadow-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Who We Are
          </motion.h1>
          <motion.div
            className="w-16 md:w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mb-4 md:mb-6"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            JMD Tailors blends tradition and precision to craft garments that express your unique style.
          </motion.p>
        </motion.div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-yellow-50/30 to-transparent pointer-events-none" />
      </div>

      <motion.div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <motion.div className="space-y-6 lg:space-y-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <div className="mb-8 lg:mb-10">
                <div className="flex items-center mb-4">
                  <span className="inline-block w-3 h-3 rounded-full bg-amber-600 mr-3 animate-pulse"></span>
                  <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase font-serif">
                    OUR LEGACY
                  </h2>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-4 font-serif leading-tight">
                  Crafting Excellence Since 2017
                </h3>
                <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
              </div>
              
              <div className="space-y-6">
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed font-light">
                  At JMD Tailors, we believe clothing is more than fabric and thread—it's a story, a statement, and a legacy. Since 2017, we've dedicated ourselves to creating garments that fit perfectly and reflect the unique personality of every client.
                </p>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed font-light">
                  Our mission is to blend traditional tailoring with modern design, ensuring every stitch is intentional and every detail is crafted with care. Experience the art of bespoke tailoring with us.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 md:gap-8 pt-6 md:pt-8">
                <motion.div 
                  className="text-center p-4 md:p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-600 font-serif mb-2">7+</div>
                  <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wider font-medium">Years Experience</div>
                </motion.div>
                <motion.div 
                  className="text-center p-4 md:p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-600 font-serif mb-2">5000+</div>
                  <div className="text-xs md:text-sm text-gray-600 uppercase tracking-wider font-medium">Happy Customers</div>
                </motion.div>
              </div>
            </motion.div>
            {/* Enhanced Image */}
            <motion.div
              className="relative flex justify-center items-center order-first lg:order-last"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="relative group">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-amber-100 group-hover:border-amber-200 transition-all duration-500">
                  <img
                    src="./images/scissor.jpg"
                    alt="Tailor working on fabric"
                    className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Floating badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Master Craftsmanship</span>
                  </div>
                </div>
                
                {/* Enhanced Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500 animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full opacity-15 group-hover:opacity-25 transition-opacity duration-500"></div>
                
                {/* Decorative SVG elements */}
                <svg className="absolute bottom-4 right-4 w-16 h-16 opacity-30 group-hover:opacity-50 transition-opacity duration-500" viewBox="0 0 64 64" fill="none">
                  <path d="M8 56C24 32 40 32 56 8" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="32" cy="32" r="20" stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.5"/>
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        {/* Decorative SVG Wave */}
        <div className="absolute top-0 left-0 w-full -translate-y-full z-10 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 sm:h-20 md:h-24">
            <path d="M0,80 C360,160 1080,0 1440,80 L1440,0 L0,0 Z" fill="#fef3c7" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto text-center mb-8 md:mb-12 relative z-20">
          <BlurFade direction="up" offset={24}>
            <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 md:mb-6 font-serif animate-fadeInUp">OUR VALUES & PHILOSOPHY</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-4 font-serif leading-tight px-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>What Drives JMD Tailors</h3>
            <div className="flex justify-center mb-6 md:mb-8 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center space-x-3">
                <div className="w-6 md:w-8 h-px bg-amber-300"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-amber-400 rounded-full animate-pulse"></div>
                <div className="w-6 md:w-8 h-px bg-amber-300"></div>
              </div>
            </div>
          </BlurFade>
        </div>
        <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: <HandshakeIcon className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />, // Craftsmanship
              title: 'Master Craftsmanship',
              desc: 'Our skilled artisans bring decades of expertise to every stitch, ensuring each garment meets the highest standards of quality.'
            },
            {
              icon: <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />, // Integrity
              title: 'Trust & Integrity',
              desc: 'Built on honest relationships and transparent practices, we earn your trust through consistent quality and reliable service.'
            },
            {
              icon: <Palette className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />, // Personalization
              title: 'Bespoke Excellence',
              desc: 'From initial consultation to final fitting, every detail is customized to reflect your personal style and perfect fit.'
            },
            {
              icon: <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600" />, // Timeliness
              title: 'Timely Delivery',
              desc: 'We value your time as much as our craft. Every order is completed with precision and delivered exactly when promised.'
            }
          ].map((v, i) => (
            <BlurFade key={i} delay={i * 0.1} direction="up" offset={24}>
              <Tilt
                glareEnable={true}
                glareMaxOpacity={0.15}
                glareColor="#fbbf24"
                tiltMaxAngleX={8}
                tiltMaxAngleY={8}
                className="rounded-2xl sm:rounded-3xl"
                transitionSpeed={1200}
                scale={1.02}
              >
                <div className="group relative bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 p-6 sm:p-8 lg:p-10 flex flex-col items-center border border-amber-100 hover:border-amber-300 hover:bg-amber-50/70 hover:backdrop-blur-2xl min-h-[280px] sm:min-h-[320px]">
                  <div className="mb-4 sm:mb-6 flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 shadow-md group-hover:scale-110 transition-transform duration-300 border-2 border-amber-200 group-hover:border-amber-400">
                    {v.icon}
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 font-serif group-hover:text-amber-700 transition-colors duration-300 tracking-wide text-center">{v.title}</h4>
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-px bg-amber-300"></div>
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      <div className="w-3 h-px bg-amber-300"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base group-hover:text-gray-700 transition-colors duration-300 text-center font-light">{v.desc}</p>
                  <div className="mt-4 sm:mt-6 h-1 w-8 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {/* Floating thread SVG accent */}
                  <svg className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-12 h-12 sm:w-16 sm:h-16 opacity-20 group-hover:opacity-40 transition-opacity duration-500" viewBox="0 0 64 64" fill="none"><path d="M8 56C24 32 40 32 56 8" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/></svg>
                </div>
              </Tilt>
            </BlurFade>
          ))}
        </div>
        {/* Floating decorative needle SVG - Hidden on mobile for cleaner look */}
        <svg className="hidden sm:block absolute left-4 bottom-4 sm:left-8 sm:bottom-8 w-12 h-12 sm:w-16 sm:h-16 opacity-30 z-10 animate-bounce-slow" viewBox="0 0 64 64" fill="none"><rect x="28" y="8" width="8" height="48" rx="4" fill="#fbbf24"/><rect x="30" y="4" width="4" height="8" rx="2" fill="#f59e42"/></svg>
        
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
          
          .animate-bounce-slow {
            animation: bounce-slow 3.2s infinite cubic-bezier(.5,0,.5,1);
          }
          
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-16px); }
          }
          
          /* Responsive adjustments */
          @media (max-width: 640px) {
            .animate-fadeInUp {
              animation-duration: 0.6s;
            }
          }
        `}</style>
      </section>

      {/* Our Process */}
      <motion.section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        {/* SVG Divider at top */}
        <div className="absolute top-0 left-0 w-full -translate-y-full z-10 pointer-events-none">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-24">
            <path d="M0,80 C360,160 1080,0 1440,80 L1440,0 L0,0 Z" fill="#fff" />
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 md:mb-6 font-serif">OUR PROCESS</h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-4 md:mb-6 font-serif leading-tight px-4">How We Work</h3>
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 md:w-12 h-px bg-amber-300"></div>
              <div className="w-3 h-3 md:w-4 md:h-4 bg-amber-400 rounded-full animate-pulse"></div>
              <div className="w-8 md:w-12 h-px bg-amber-300"></div>
            </div>
          </div>
        </div>
        
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {[
            { icon: <User className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />, title: 'Consultation', desc: 'We start with a personal consultation to understand your needs and style preferences.' },
            { icon: <Ruler className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />, title: 'Measurement', desc: 'Precise measurements ensure a perfect fit tailored to your body.' },
            { icon: <Scissors className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />, title: 'Crafting', desc: 'Our skilled artisans bring your vision to life with expert tailoring.' },
            { icon: <Shirt className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />, title: 'Fitting', desc: 'We fine-tune every detail for perfect comfort and style.' },
            { icon: <PackageCheck className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />, title: 'Delivery', desc: 'Your bespoke garment is delivered, ready to wear with confidence.' }
          ].map((step, i) => (
            <motion.div 
              key={i} 
              className="group relative bg-white/70 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-100 hover:border-amber-300 hover:bg-white/90 sm:col-span-1 lg:col-span-1" 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: i * 0.1 }} 
              viewport={{ once: true }} 
              whileHover={{ scale: 1.05, y: -8 }}
            >
              {/* Step number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {i + 1}
              </div>
              
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 border-2 border-amber-200 group-hover:border-amber-400">
                {step.icon}
              </div>
              
              <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 font-serif group-hover:text-amber-700 transition-colors duration-300">{step.title}</h4>
              
              <div className="flex justify-center mb-3 md:mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-px bg-amber-300"></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <div className="w-4 h-px bg-amber-300"></div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm md:text-base leading-relaxed group-hover:text-gray-700 transition-colors duration-300 font-light">{step.desc}</p>
              
              {/* Connecting line (hidden on mobile) */}
              {i < 4 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-amber-300 to-transparent"></div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.section>


      {/* Our Promise */}
      <motion.section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <div className="max-w-5xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 md:mb-6 font-serif">OUR PROMISE</h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-6 md:mb-8 font-serif leading-tight px-4">A Commitment to You</h3>
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-12 md:w-16 h-px bg-amber-300"></div>
              <div className="w-4 h-4 md:w-5 md:h-5 bg-amber-400 rounded-full animate-pulse"></div>
              <div className="w-12 md:w-16 h-px bg-amber-300"></div>
            </div>
          </div>
        </div>
        
        <motion.div 
          className="max-w-4xl mx-auto relative"
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }} 
          viewport={{ once: true }}
        >
          {/* Main promise card */}
          <div className="relative bg-gradient-to-br from-white via-amber-50/50 to-orange-50/30 backdrop-blur-sm rounded-3xl md:rounded-[2rem] p-8 md:p-12 lg:p-16 text-center shadow-2xl border border-amber-100/50 overflow-hidden group hover:shadow-3xl transition-all duration-700">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full translate-y-20 -translate-x-20"></div>
            
            {/* Quote icon */}
            <div className="relative z-10 mb-6 md:mb-8">
              <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto text-amber-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
            </div>
            
            {/* Promise text */}
            <div className="relative z-10">
              <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-light leading-relaxed mb-6 md:mb-8">
                At JMD Tailors, we promise to honor your individuality, respect your time, and deliver garments that exceed your expectations. Our legacy is built on trust, quality, and a passion for making you look and feel your best.
              </p>
              
              {/* Signature-style element */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
                <p className="text-sm md:text-base text-amber-600 font-semibold uppercase tracking-wider">JMD Tailors Team</p>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-1/4 left-8 w-2 h-2 bg-amber-400 rounded-full opacity-40 animate-pulse"></div>
            <div className="absolute bottom-1/3 right-12 w-3 h-3 bg-orange-400 rounded-full opacity-30 animate-bounce"></div>
          </div>
          
         
        </motion.div>
      </motion.section>

    <CTA/>
    </div>
  );
};

export default JMDTailorsAbout;