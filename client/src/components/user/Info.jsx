import React from 'react';
import { motion } from 'framer-motion';

const BespokeServicesGrid = () => {
  const services = [
    {
      title: "MADE TO MEASURE",
      description: "Precision tailoring crafted to your exact measurements",
      image: "/images/measure.png",
    },
    {
      title: "CUSTOM DENIM",
      description: "Artisan-crafted denim pieces tailored to perfection",
      image: "/images/needle.png",
    },
    {
      title: "WEDDINGS",
      description: "Elegant wedding attire for your special day",
      image: "/images/wedding.png",
    },
    {
      title: "ALTERATIONS",
      description: "Expert modifications to perfect your garments",
      image: "/images/alteratin.png",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 md:mb-8">
            <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto text-amber-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10 L60 30 L80 30 L65 45 L70 65 L50 55 L30 65 L35 45 L20 30 L40 30 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          </div>
          <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 md:mb-6 font-serif">
            STOP COMPROMISING
          </h2>
          <h1 className="text-2xl xs:text-3xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-4 font-serif leading-tight px-2 xs:px-4">
            Bespoke Service – Friendly Prices
          </h1>
          <div className="w-16 md:w-24 h-0.5 bg-amber-600 mx-auto mt-4 md:mt-6"></div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative bg-white rounded-3xl overflow-hidden"
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.3 } 
              }}
            >
              {/* Background Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
              
              {/* Card Content */}
              <div className="relative p-6 md:p-8 text-center h-full flex flex-col">
                {/* Icon Container */}
                <div className="mb-6 md:mb-8 flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-12 h-12 md:w-14 md:h-14 object-contain group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm"
                      />
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute -inset-2 rounded-2xl border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-[11px] xs:text-xs md:text-sm font-bold text-gray-700 tracking-[0.15em] uppercase mb-2 xs:mb-3 md:mb-4 font-serif group-hover:text-amber-700 transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Elegant Divider */}
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 md:w-4 h-px bg-amber-300"></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-400 rounded-full"></div>
                    <div className="w-3 md:w-4 h-px bg-amber-300"></div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] xs:text-xs md:text-sm text-gray-600 leading-relaxed font-light tracking-wide flex-grow group-hover:text-gray-700 transition-colors duration-300">
                  {service.description}
                </p>

                {/* Subtle bottom accent */}
                <div className="mt-4 md:mt-6 h-1 w-8 md:w-12 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Card Shadow */}
              <div className="absolute inset-0 rounded-3xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className="mt-16 md:mt-24 text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-6 md:w-8 h-px bg-amber-300"></div>
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-amber-400 rounded-full"></div>
              <div className="w-6 md:w-8 h-px bg-amber-300"></div>
            </div>
          </div>
          <p className="text-[13px] xs:text-sm md:text-base text-gray-600 italic max-w-2xl mx-auto font-light leading-relaxed">
            "Excellence in craftsmanship, delivered with care and attention to every detail. 
            Your satisfaction is our commitment to timeless quality."
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BespokeServicesGrid;