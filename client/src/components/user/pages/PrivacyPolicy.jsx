import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Header Section */}
      <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh] flex items-center justify-center text-center text-white overflow-hidden mb-8 sm:mb-12 mt-[80px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/tailor.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
        
        {/* Breadcrumbs */}
        <nav
          className="absolute top-12 sm:top-12 md:top-12 lg:top-20 left-1/2 -translate-x-1/2 z-20"
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
            <li className="text-amber-200 font-semibold">Privacy Policy</li>
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
            Privacy Policy
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 font-light drop-shadow mt-1 sm:mt-2 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Your privacy is important to us. Learn how we protect your personal information.
          </motion.p>
        </motion.div>
      </div>

      {/* Content Section */}
      <motion.section 
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100 p-8 md:p-12">
            
            {/* Last Updated */}
            <div className="text-center mb-12">
              <p className="text-gray-600 text-sm">Last updated: January 1, 2025</p>
            </div>

            {/* Introduction */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Introduction</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At JMD STITCHING PRIVATE LIMITED ("we," "our," or "us"), we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our premises or use our services.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By using our services, you consent to the data practices described in this policy.
              </p>
            </motion.div>

            {/* Information We Collect */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Information We Collect</h2>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
              <div className="space-y-4 text-gray-600 leading-relaxed mb-6">
                <p>We may collect the following personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name and contact information (phone number, email address)</li>
                  <li>Physical address for delivery purposes</li>
                  <li>Body measurements for tailoring services</li>
                  <li>Payment information (processed securely)</li>
                  <li>Preferences and special requirements</li>
                  <li>Photos of garments (with your consent)</li>
                </ul>
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mb-4">Automatically Collected Information</h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>When you visit our website, we may automatically collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>IP address and browser information</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </motion.div>

            {/* How We Use Your Information */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">How We Use Your Information</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>We use your information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Providing tailoring services and custom fittings</li>
                  <li>Processing orders and payments</li>
                  <li>Communicating about your orders and appointments</li>
                  <li>Improving our services and customer experience</li>
                  <li>Sending promotional materials (with your consent)</li>
                  <li>Maintaining records for quality assurance</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </div>
            </motion.div>

            {/* Information Sharing */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Information Sharing and Disclosure</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> With trusted partners who assist in our operations (payment processors, delivery services)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfer:</strong> In the event of a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                </ul>
              </div>
            </motion.div>

            {/* Data Security */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Data Security</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>We implement appropriate security measures to protect your personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Secure storage of physical records in locked cabinets</li>
                  <li>Password-protected digital systems</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                  <li>Regular security assessments and updates</li>
                  <li>Secure payment processing through trusted providers</li>
                </ul>
                <p className="mt-4">
                  However, no method of transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </motion.div>

            {/* Data Retention */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Data Retention</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>We retain your personal information for as long as necessary to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide our services and maintain your account</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Maintain records for quality assurance (typically 3-5 years)</li>
                </ul>
                <p className="mt-4">
                  Measurement records are typically retained for 2 years to facilitate future orders and alterations.
                </p>
              </div>
            </motion.div>

            {/* Your Rights */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Your Privacy Rights</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </div>
            </motion.div>

            {/* Cookies Policy */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Cookies and Tracking</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>Our website uses cookies to improve your experience:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
                <p className="mt-4">
                  You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.
                </p>
              </div>
            </motion.div>

            {/* Third-Party Services */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Third-Party Services</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>We may use third-party services that have their own privacy policies:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Payment processors (for secure transaction processing)</li>
                  <li>Analytics services (to improve our website)</li>
                  <li>Communication platforms (for customer support)</li>
                  <li>Delivery services (for garment delivery)</li>
                </ul>
                <p className="mt-4">
                  We encourage you to review the privacy policies of these third-party services.
                </p>
              </div>
            </motion.div>

            {/* Children's Privacy */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Children's Privacy</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.
                </p>
                <p>
                  For children's garments, we require parental consent and the presence of a parent or guardian during measurements and fittings.
                </p>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div className="mb-8" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Contact Us</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="bg-amber-50 p-6 rounded-xl">
                  <p><strong>JMD STITCHING PRIVATE LIMITED</strong></p>
                  <p>108, Infinity Business Park, Dombivali East, Maharashtra</p>
                  <p>Phone: +91 9082150556</p>
                  <p>Email: info@jmdstithing.com</p>
                  <p>Email: info@jmdtailors.com</p>
                </div>
              </div>
            </motion.div>

            {/* Changes to Policy */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically for any changes.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default PrivacyPolicy; 