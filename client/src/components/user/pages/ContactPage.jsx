import React, { useState } from "react";
import CTA from "../CTA";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useCreateEnquiryMutation } from '@/features/api/enquiryApi';
import { useGetAllServicesQuery } from '@/features/api/serviceApi';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    serviceName: '',
    message: ''
  });

  // API hooks
  const [createEnquiry, { isLoading: isSubmitting }] = useCreateEnquiryMutation();
  const { data: servicesData } = useGetAllServicesQuery({
    page: 1,
    limit: 100,
    status: 'active'
  });

  const services = servicesData?.services || [];

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.phone.trim() || !formData.service || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phone.trim(),
        serviceId: formData.service,
        serviceName: formData.serviceName,
        message: formData.message.trim(),
        source: 'contact_page'
      }).unwrap();

      toast.success('Thank you for your message! We\'ll get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        serviceName: '',
        message: ''
      });
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast.error(error?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 pt-2 md:pt-0 relative">
      {/* Header with background image and overlay */}
      <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh] flex items-center justify-center text-center text-white overflow-hidden mb-8 sm:mb-12 mt-[100px] sm:mt-[110px] md:mt-[120px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/banner-2.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
        {/* Breadcrumbs - Fixed positioning for better visibility */}
        <nav
          className="absolute top-16 sm:top-12 md:top-16 lg:top-20 left-1/2 -translate-x-1/2 z-20"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm md:text-base">
            <li>
              <a
                href="/"
                className="text-white/80 hover:text-amber-300 transition-colors"
              >
                Home
              </a>
            </li>
            <li className="text-white/60">/</li>
            <li className="text-amber-200 font-semibold">Contact</li>
          </ol>
        </nav>
        <motion.div
          className="relative z-10 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-2 sm:mb-3 md:mb-4 font-serif leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Get In Touch with JMD Tailors
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 font-light drop-shadow mt-1 sm:mt-2 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            We're here to help you with all your stitching needs.
          </motion.p>
        </motion.div>
      </div>

      {/* Contact Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-px bg-amber-300"></div>
              <div className="mx-4 w-3 h-3 bg-amber-400 rounded-full"></div>
              <div className="w-12 h-px bg-amber-300"></div>
            </div>
            <h2 className="text-xs font-bold text-amber-600 tracking-[0.3em] uppercase mb-4 font-serif">
              GET IN TOUCH
            </h2>
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-6 font-serif leading-tight">
              We'd Love to Hear
              <br />
              <span className="text-amber-600 font-medium italic">From You</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto font-light">
              Ready to create your perfect fit? Let's discuss your vision and bring it to life with our expert craftsmanship.
            </p>
          </motion.div>

          <div className="relative">
            {/* Decorative Background Elements */}
            <div 
              className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-10"
              style={{ background: 'radial-gradient(circle, rgba(227, 184, 115, 0.4) 0%, transparent 70%)' }}
            ></div>
            <div 
              className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-10"
              style={{ background: 'radial-gradient(circle, rgba(227, 184, 115, 0.3) 0%, transparent 70%)' }}
            ></div>

            <div className="bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-amber-200/40 relative">
              {/* Glass overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-amber-50/20 pointer-events-none"></div>
              
              <div className="flex flex-col lg:flex-row relative z-10">
                {/* Map Area */}
                <motion.div 
                  className="w-full lg:w-1/2 h-96 lg:h-auto relative group"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {/* Map overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-transparent to-amber-800/5 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 pointer-events-none"></div>
                  
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1928970.5599876058!2d70.66893415625!3d19.21612910000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be795c8e51ee17f%3A0x561500b879ac7b6b!2sINFINITY%20BUSINESS%20PARK!5e0!3m2!1sen!2sin!4v1752780528497!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="transition-all duration-500 group-hover:saturate-110"
                  ></iframe>
                  
                  {/* Location badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-amber-200/50">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">JMD Tailors</span>
                    </div>
                </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div 
                  className="w-full lg:w-1/2 p-8 lg:p-12"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-10">
                    <h2 className="text-3xl lg:text-4xl font-light text-gray-800 mb-4 font-serif">
                      Let's Create Something
                      <br />
                      <span className="text-amber-600 italic">Extraordinary</span>
                    </h2>
                    <p className="text-gray-600 font-light leading-relaxed">
                      Share your requirements and we'll craft the perfect solution tailored just for you.
                    </p>
              </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div 
                        className="form-group relative"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-5 py-4 border border-amber-200/60 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md text-gray-700 placeholder-gray-500 font-light"
                          style={{ '--tw-ring-color': '#e3b873' }}
                          required
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/5 to-orange-300/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </motion.div>
                      
                      <motion.div 
                        className="form-group relative"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-5 py-4 border border-amber-200/60 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md text-gray-700 placeholder-gray-500 font-light"
                          style={{ '--tw-ring-color': '#e3b873' }}
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/5 to-orange-300/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </motion.div>
                </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div 
                        className="form-group relative"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-5 py-4 border border-amber-200/60 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md text-gray-700 placeholder-gray-500 font-light"
                          style={{ '--tw-ring-color': '#e3b873' }}
                          required
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/5 to-orange-300/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </motion.div>
                      
                      <motion.div 
                        className="form-group relative"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <select
                          name="service"
                          value={formData.service}
                          onChange={(e) => {
                            const selectedService = services.find(s => s._id === e.target.value);
                            handleInputChange('service', e.target.value);
                            handleInputChange('serviceName', selectedService?.title || '');
                          }}
                          className="w-full px-5 py-4 border border-amber-200/60 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md text-gray-700 font-light appearance-none cursor-pointer"
                          style={{ '--tw-ring-color': '#e3b873' }}
                          required
                        >
                          <option value="">Select Service</option>
                          {services.map((service) => (
                            <option key={service._id} value={service._id}>
                              {service.title} - {service.category}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
              </div>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/5 to-orange-300/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </motion.div>
                </div>

                    <motion.div 
                      className="form-group relative"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <textarea
                        name="message"
                        placeholder="Tell us about your vision, requirements, or any specific details..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="w-full px-5 py-4 border border-amber-200/60 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent h-36 resize-none bg-white/80 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md text-gray-700 placeholder-gray-500 font-light"
                        style={{ '--tw-ring-color': '#e3b873' }}
                        required
                      ></textarea>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/5 to-orange-300/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pt-4">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative inline-flex items-center justify-center px-8 py-4 font-serif tracking-wider shadow-lg transition-all duration-300 ease-out overflow-hidden border-2 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ 
                          borderRadius: 0,
                          background: '#e3b873', 
                          color: '#222', 
                          borderColor: '#e3b873' 
                        }}
                        whileHover={!isSubmitting ? { scale: 1.05, y: -2 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                        onMouseOver={e => { 
                          if (!isSubmitting) {
                            e.currentTarget.style.background = '#222'; 
                            e.currentTarget.style.color = '#e3b873'; 
                            e.currentTarget.style.borderColor = '#222'; 
                          }
                        }}
                        onMouseOut={e => { 
                          if (!isSubmitting) {
                            e.currentTarget.style.background = '#e3b873'; 
                            e.currentTarget.style.color = '#222'; 
                            e.currentTarget.style.borderColor = '#e3b873'; 
                          }
                        }}
                      >
                        <span className="relative flex items-center space-x-2">
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                          <span>Send Message</span>
                          <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                            </>
                          )}
                        </span>
                      </motion.button>
                      
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-light">We typically respond within 24 hours</span>
              </div>
                </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Contact Info Cards */}
          <motion.div 
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Phone */}
            <motion.div 
              className="group relative bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-amber-200/40 transition-all duration-500 hover:shadow-2xl overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-200/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="relative">
                    <div 
                      className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                      style={{ background: 'linear-gradient(135deg, #e3b873 0%, #d4a574 100%)' }}
                    >
                      <Phone className="h-8 w-8 text-white" />
                    </div>
                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 group-hover:animate-ping" style={{ background: '#e3b873' }}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-800 font-serif mb-3 group-hover:text-amber-700 transition-colors duration-300">
                      Call Us
                    </h3>
                    <div className="space-y-2">
                      <a 
                        href="tel:+917972889376" 
                        className="block text-gray-700 hover:text-gray-900 font-medium transition-all duration-300 relative group/link"
                      >
                        +91 797 288 9376
                        <span 
                          className="absolute left-0 -bottom-1 w-0 h-0.5 transition-all duration-300 group-hover/link:w-full"
                          style={{ background: '#e3b873' }}
                        ></span>
                      </a>
                      <a
                        href="mailto:info@jmdtailors.com"
                        className="block text-gray-600 hover:text-gray-800 font-light transition-all duration-300 relative group/link text-sm"
                      >
                        info@jmdtailors.com
                        <span 
                          className="absolute left-0 -bottom-1 w-0 h-0.5 transition-all duration-300 group-hover/link:w-full"
                          style={{ background: '#e3b873' }}
                        ></span>
                      </a>
                    </div>
            </div>
            </div>
                <div className="flex items-center text-xs text-gray-500 font-light">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Available now
            </div>
            </div>
            </motion.div>

            {/* Address */}
            <motion.div 
              className="group relative bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-amber-200/40 transition-all duration-500 hover:shadow-2xl overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-200/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="relative">
                    <div 
                      className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                      style={{ background: 'linear-gradient(135deg, #e3b873 0%, #d4a574 100%)' }}
                    >
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 group-hover:animate-ping" style={{ background: '#e3b873' }}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-800 font-serif mb-3 group-hover:text-amber-700 transition-colors duration-300">
                      Visit Our Studio
                    </h3>
                    <a 
                      href="https://maps.google.com/?q=108,+Infinity+Business+Park,+Dombivali+East,+Maharashtra" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800 font-light leading-relaxed transition-all duration-300 relative group/link block"
                    >
                      108, Infinity Business Park<br />
                      Dombivali East, Maharashtra<br />
                      <span className="text-amber-600 text-sm font-medium">401208</span>
                      <span 
                        className="absolute left-0 -bottom-1 w-0 h-0.5 transition-all duration-300 group-hover/link:w-full"
                        style={{ background: '#e3b873' }}
                      ></span>
                    </a>
        </div>
        </div>
                <div className="flex items-center text-xs text-gray-500 font-light">
                  <svg className="w-3 h-3 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Click for directions
        </div>
      </div>
            </motion.div>

            {/* Hours */}
            <motion.div 
              className="group relative bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-amber-200/40 transition-all duration-500 hover:shadow-2xl overflow-hidden"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-200/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="relative">
                    <div 
                      className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                      style={{ background: 'linear-gradient(135deg, #e3b873 0%, #d4a574 100%)' }}
                    >
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 group-hover:animate-ping" style={{ background: '#e3b873' }}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-800 font-serif mb-3 group-hover:text-amber-700 transition-colors duration-300">
                      Opening Hours
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-light">Mon - Sat</span>
                        <span className="text-gray-800 font-medium">10:00 AM - 8:00 PM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-light">Sunday</span>
                        <span className="text-red-500 font-medium">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-xs text-gray-500 font-light">
                  <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                  Open today until 8:00 PM
                </div>
              </div>
            </motion.div>
          </motion.div>
      </div>
      </section>
      
      {/* CTA Section */}
      <CTA />
      </div>
  );
};

export default ContactPage;
