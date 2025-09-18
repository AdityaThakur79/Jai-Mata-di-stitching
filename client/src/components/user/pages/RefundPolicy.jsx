import React from 'react';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Header Section */}
      <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh] flex items-center justify-center text-center text-white overflow-hidden mb-8 sm:mb-12 mt-[80px] ">
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
            <li className="text-amber-200 font-semibold">Refund Policy</li>
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
            Refund Policy
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 font-light drop-shadow mt-1 sm:mt-2 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Understanding our refund and cancellation policies for custom tailoring services.
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
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Our Refund Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At JMD STITCHING PRIVATE LIMITED, we understand that custom tailoring is a significant investment. This refund policy outlines the terms and conditions for cancellations, refunds, and exchanges for our tailoring services.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Please read this policy carefully before placing your order, as custom-made garments have specific terms due to their personalized nature.
              </p>
            </motion.div>

            {/* Cancellation Policy */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Cancellation Policy</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">✓ Full Refund (Within 24 Hours)</h3>
                  <ul className="list-disc list-inside space-y-2 text-green-700">
                    <li>Orders cancelled within 24 hours of confirmation</li>
                    <li>100% refund of advance payment</li>
                    <li>No questions asked cancellation</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Partial Refund (Before Cutting)</h3>
                  <ul className="list-disc list-inside space-y-2 text-yellow-700">
                    <li>Orders cancelled after 24 hours but before fabric cutting</li>
                    <li>75% refund of advance payment</li>
                    <li>25% processing fee applies</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">✗ Limited Refund (After Cutting)</h3>
                  <ul className="list-disc list-inside space-y-2 text-red-700">
                    <li>Orders cancelled after fabric cutting has begun</li>
                    <li>50% refund of advance payment</li>
                    <li>Fabric and material costs are non-refundable</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Refund Eligibility */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Refund Eligibility</h2>
              
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Eligible for Refund:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed mb-6">
                <li>Manufacturing defects or construction errors</li>
                <li>Significant deviation from agreed specifications</li>
                <li>Wrong fabric or color used (our error)</li>
                <li>Garment delivered with damage</li>
                <li>Inability to achieve proper fit after 3 fittings</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-700 mb-4">Not Eligible for Refund:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
                <li>Change of mind after garment completion</li>
                <li>Weight changes affecting fit</li>
                <li>Natural fabric characteristics (shrinkage, color variation)</li>
                <li>Damage due to improper care or handling</li>
                <li>Garments worn or altered by another tailor</li>
                <li>Orders placed during sale periods (unless defective)</li>
              </ul>
            </motion.div>

            {/* Refund Process */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Refund Process</h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-700">Step 1: Contact Us</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Contact us within 7 days of delivery for defects</li>
                  <li>Provide order details and reason for refund request</li>
                  <li>Submit photos if claiming manufacturing defects</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-700 mt-6">Step 2: Evaluation</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Our team will evaluate your refund request</li>
                  <li>Physical inspection may be required</li>
                  <li>Decision communicated within 2-3 business days</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-700 mt-6">Step 3: Refund Processing</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Approved refunds processed within 7-10 business days</li>
                  <li>Refund made to original payment method</li>
                  <li>Refund confirmation sent via email/SMS</li>
                </ul>
              </div>
            </motion.div>

            {/* Exchange Policy */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Exchange Policy</h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>We offer exchanges in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Size Issues:</strong> If the garment doesn't fit properly despite accurate measurements</li>
                  <li><strong>Minor Defects:</strong> Small construction issues that can be corrected</li>
                  <li><strong>Color Mismatch:</strong> Significant difference from selected fabric sample</li>
                </ul>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mt-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">Exchange Terms:</h3>
                  <ul className="list-disc list-inside space-y-2 text-blue-700">
                    <li>Exchange must be requested within 15 days of delivery</li>
                    <li>Garment must be in original condition</li>
                    <li>One free exchange per order</li>
                    <li>Additional alterations may incur charges</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Alteration Policy */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Alteration Policy</h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-700">Free Alterations:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Minor adjustments during initial fittings</li>
                  <li>Corrections for measurement errors (our fault)</li>
                  <li>Construction defects within 30 days</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-700 mt-6">Paid Alterations:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Changes due to weight fluctuation</li>
                  <li>Style modifications after completion</li>
                  <li>Alterations after 30 days of delivery</li>
                  <li>Additional fittings beyond included sessions</li>
                </ul>
              </div>
            </motion.div>

            {/* Special Circumstances */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Special Circumstances</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Wedding & Special Occasion Orders:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Rush order cancellations subject to 75% refund maximum</li>
                    <li>No refunds within 7 days of event date</li>
                    <li>Emergency alterations available at premium rates</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Bulk Orders:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Partial cancellations allowed with pro-rated charges</li>
                    <li>Minimum order requirements may apply for refunds</li>
                    <li>Volume discounts may be adjusted for partial cancellations</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Contact for Refunds */}
            <motion.div className="mb-8" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Contact for Refunds</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>For refund requests or questions about this policy, please contact us:</p>
                <div className="bg-amber-50 p-6 rounded-xl">
                  <p><strong>JMD STITCHING PRIVATE LIMITED</strong></p>
                  <p>108, Infinity Business Park, Dombivali East, Maharashtra</p>
                  <p>Phone: +91 9082150556</p>
                  <p>Email: info@jmdstithing.com</p>
                  <p>Email: info@jmdtailors.com</p>
                  <p className="mt-4 text-sm text-gray-500">
                    <strong>Business Hours:</strong> Monday - Saturday: 10:00 AM - 8:00 PM
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Important Notes */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Important Notes</h2>
              <div className="bg-gray-50 p-6 rounded-xl space-y-3 text-gray-600">
                <p>• All refunds are subject to inspection and approval by our quality team</p>
                <p>• Processing fees and transaction charges are non-refundable</p>
                <p>• Refund timelines may vary based on payment method and bank processing</p>
                <p>• This policy is subject to change; current version applies to all orders</p>
                <p>• For disputes, we encourage direct communication before escalation</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default RefundPolicy; 