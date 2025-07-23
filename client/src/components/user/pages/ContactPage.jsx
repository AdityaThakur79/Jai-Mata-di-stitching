import React from "react";
import CTA from "../CTA";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";

const ContactPage = () => {
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
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Contact Info */}
          <motion.div
            className="w-full lg:w-1/2 flex flex-col gap-6 animate-fadeInUp justify-between"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-white/60 backdrop-blur-lg rounded-sm shadow-xl border border-amber-100 p-8 flex flex-col gap-4 h-full justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-6 h-6 text-amber-500" />
                  <span className="text-lg font-semibold text-gray-800">Address</span>
                </div>
                <p className="text-gray-700">Shop No. 12, JMD Tailors, Main Market, New Delhi, India</p>
              </div>
              <div>
                <div className="flex items-center gap-3 mt-4">
                  <Phone className="w-6 h-6 text-amber-500" />
                  <span className="text-lg font-semibold text-gray-800">Phone</span>
                </div>
                <p className="text-gray-700">+91 98765 43210</p>
              </div>
              <div>
                <div className="flex items-center gap-3 mt-4">
                  <Mail className="w-6 h-6 text-amber-500" />
                  <span className="text-lg font-semibold text-gray-800">Email</span>
                </div>
                <p className="text-gray-700">support@jmdtailors.in</p>
              </div>
              <div>
                <div className="flex items-center gap-3 mt-4">
                  <Clock className="w-6 h-6 text-amber-500" />
                  <span className="text-lg font-semibold text-gray-800">Working Hours</span>
                </div>
                <p className="text-gray-700">Mon – Sat: 10:00 AM – 8:00 PM<br />Sun: Closed</p>
              </div>
            </div>
          </motion.div>
          {/* Contact Form */}
          <motion.form
            className="w-full lg:w-1/2 bg-white/60 backdrop-blur-lg rounded-sm shadow-xl border border-amber-100 p-8 flex flex-col gap-6 animate-fadeInUp h-full justify-between"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            onSubmit={(e) => {
              e.preventDefault();
              alert("Form submitted!");
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white/80"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="9876543210"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white/80"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows="4"
                placeholder="Write your query here..."
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white/80"
                required
              ></textarea>
            </div>
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-300 text-gray-900 py-3 rounded-xl font-semibold shadow-lg hover:from-orange-400 hover:to-amber-400 transition-all text-lg tracking-wide"
              whileHover={{ scale: 1.04 }}
            >
              Send Message
            </motion.button>
          </motion.form>
        </div>
        </div>
        
        {/* Map below both columns */}
        <div className="my-10 rounded-3xl overflow-hidden border border-amber-100 shadow-xl bg-white/60 backdrop-blur-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1928970.5599876058!2d70.66893415625!3d19.21612910000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be795c8e51ee17f%3A0x561500b879ac7b6b!2sINFINITY%20BUSINESS%20PARK!5e0!3m2!1sen!2sin!4v1752780528497!5m2!1sen!2sin"
            width="100%"
            height="260"
            className="rounded-3xl border-none"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
 
  );
};

const ContactTextArea = ({ row, placeholder, name, defaultValue }) => {
  return (
    <>
      <div className="mb-6">
        <textarea
          rows={row}
          placeholder={placeholder}
          name={name}
          className="w-full resize-none rounded border border-stroke px-[14px] py-3 text-base text-body-color outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6"
          defaultValue={defaultValue}
        />
      </div>
    </>
  );
};

const ContactInputBox = ({ type, placeholder, name }) => {
  return (
    <>
      <div className="mb-6">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          className="w-full rounded border border-stroke px-[14px] py-3 text-base text-body-color outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6"
        />
      </div>
    </>
  );
};

export default ContactPage;
