import React from 'react';
import { motion } from 'framer-motion';

const TermsConditions = () => {
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
            <li className="text-amber-200 font-semibold">Terms & Conditions</li>
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
            Terms & Conditions
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 font-light drop-shadow mt-1 sm:mt-2 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Please read these terms and conditions carefully before using our services.
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
                Welcome to JAI MATA DI STITCHING ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our tailoring services and website located at our business premises and online platforms.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access our services.
              </p>
            </motion.div>

            {/* Services */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Our Services</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>JMD Tailors provides custom tailoring services including but not limited to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Custom suits and formal wear</li>
                  <li>Traditional Indian clothing (kurtas, sherwanis, lehengas)</li>
                  <li>Casual wear and alterations</li>
                  <li>Wedding and special occasion attire</li>
                  <li>Fabric consultation and selection</li>
                </ul>
              </div>
            </motion.div>

            {/* Orders and Payments */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Orders and Payments</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-700">Order Process</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All orders require an initial consultation and measurement session</li>
                  <li>A 50% advance payment is required to confirm your order</li>
                  <li>Final payment is due upon completion and before delivery</li>
                  <li>We accept cash, bank transfers, and digital payments</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-700 mt-6">Delivery Timeline</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Standard delivery: 7-14 business days</li>
                  <li>Rush orders: 3-5 business days (additional charges apply)</li>
                  <li>Wedding/Special occasion orders: 15-21 business days</li>
                  <li>Timelines may vary during peak seasons</li>
                </ul>
              </div>
            </motion.div>

            {/* Measurements and Fittings */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Measurements and Fittings</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <ul className="list-disc list-inside space-y-2">
                  <li>Accurate measurements are crucial for proper fit. Please arrive on time for scheduled appointments</li>
                  <li>We provide up to 2 complimentary fittings per garment</li>
                  <li>Additional fittings beyond the included sessions may incur extra charges</li>
                  <li>Significant weight changes after final measurements may require additional charges</li>
                  <li>Final fitting must be completed within 30 days of garment completion</li>
                </ul>
              </div>
            </motion.div>

            {/* Alterations and Modifications */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Alterations and Modifications</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <ul className="list-disc list-inside space-y-2">
                  <li>Minor alterations during the fitting process are included in the service</li>
                  <li>Major design changes after cutting may incur additional charges</li>
                  <li>Changes to fabric selection after cutting are not permitted</li>
                  <li>We reserve the right to refuse alterations that may compromise garment quality</li>
                </ul>
              </div>
            </motion.div>

            {/* Cancellation and Refund Policy */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Cancellation and Refund Policy</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <ul className="list-disc list-inside space-y-2">
                  <li>Orders can be cancelled within 24 hours of confirmation with full refund</li>
                  <li>Cancellations after cutting has begun will incur a 50% charge</li>
                  <li>Completed garments cannot be returned unless there is a manufacturing defect</li>
                  <li>Custom-made garments are non-refundable once completed to satisfaction</li>
                  <li>Refunds will be processed within 7-10 business days</li>
                </ul>
              </div>
            </motion.div>

            {/* Quality Guarantee */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Quality Guarantee</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>We stand behind the quality of our work and offer:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>6-month warranty against manufacturing defects</li>
                  <li>Free repairs for construction issues within warranty period</li>
                  <li>Satisfaction guarantee on fit and finish</li>
                  <li>Quality assurance on all fabrics and materials used</li>
                </ul>
              </div>
            </motion.div>

            {/* Customer Responsibilities */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Customer Responsibilities</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide accurate measurements and attend scheduled fittings</li>
                  <li>Communicate any specific requirements or preferences clearly</li>
                  <li>Make payments as per agreed terms</li>
                  <li>Collect completed garments within 60 days of notification</li>
                  <li>Treat our staff and premises with respect</li>
                </ul>
              </div>
            </motion.div>

            {/* Limitation of Liability */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Limitation of Liability</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Our liability is limited to the cost of the services provided. We are not responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Damages due to improper care or maintenance of garments</li>
                  <li>Color variations in different lighting conditions</li>
                  <li>Natural characteristics of fabrics (shrinkage, fading, etc.)</li>
                  <li>Delays due to circumstances beyond our control</li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div className="mb-8" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Contact Us</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>If you have any questions about these Terms and Conditions, please contact us:</p>
                <div className="bg-amber-50 p-6 rounded-xl">
                  <p><strong>JAI MATA DI STITCHING</strong></p>
                  <p>108, Infinity Business Park, Dombivali East, Maharashtra</p>
                  <p>Phone: +91 797 288 9376</p>
                  <p>Email: info@jmdtailors.com</p>
                </div>
              </div>
            </motion.div>

            {/* Changes to Terms */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                Your continued use of our services after changes constitutes acceptance of the new terms.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default TermsConditions; 