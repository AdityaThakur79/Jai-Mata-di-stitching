import React from 'react';
import { motion } from 'framer-motion';

const ShippingPolicy = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Header Section */}
      <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh] flex items-center justify-center text-center text-white overflow-hidden mb-8 sm:mb-12 mt-[100px] sm:mt-[110px] md:mt-[120px]">
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
            <li className="text-amber-200 font-semibold">Shipping Policy</li>
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
            Shipping Policy
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 font-light drop-shadow mt-1 sm:mt-2 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Learn about our delivery options, timelines, and shipping procedures.
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
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Delivery & Shipping</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At JAI MATA DI STITCHING, we ensure your custom-tailored garments reach you safely and on time. This shipping policy outlines our delivery procedures, timelines, and terms for local and outstation deliveries.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We take great care in packaging and delivering your garments to maintain their quality and presentation.
              </p>
            </motion.div>

            {/* Delivery Options */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Delivery Options</h2>
              
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">🏪 In-Store Pickup (Free)</h3>
                  <ul className="list-disc list-inside space-y-2 text-green-700">
                    <li>Collect your garments directly from our store</li>
                    <li>Final fitting and quality check before pickup</li>
                    <li>Available during business hours</li>
                    <li>No additional charges</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">🚗 Local Delivery</h3>
                  <ul className="list-disc list-inside space-y-2 text-blue-700">
                    <li>Within 15 km radius of our store</li>
                    <li>Delivery charges: ₹100 - ₹300 based on distance</li>
                    <li>Same-day delivery available for completed orders</li>
                    <li>Delivery executive will call before arrival</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">📦 Courier Delivery</h3>
                  <ul className="list-disc list-inside space-y-2 text-purple-700">
                    <li>Pan-India delivery through trusted courier partners</li>
                    <li>Charges: ₹200 - ₹500 based on location and weight</li>
                    <li>Delivery timeline: 2-5 business days</li>
                    <li>Tracking details provided via SMS/Email</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Delivery Timeline */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Delivery Timeline</h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 rounded-lg">
                    <thead>
                      <tr className="bg-amber-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Service Type</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Production Time</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Delivery Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-3">Standard Tailoring</td>
                        <td className="border border-gray-300 p-3">7-14 business days</td>
                        <td className="border border-gray-300 p-3">1-3 days post completion</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3">Rush Orders</td>
                        <td className="border border-gray-300 p-3">3-5 business days</td>
                        <td className="border border-gray-300 p-3">Same day/Next day</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3">Wedding/Special Orders</td>
                        <td className="border border-gray-300 p-3">15-21 business days</td>
                        <td className="border border-gray-300 p-3">2-5 days post completion</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3">Basic Alterations</td>
                        <td className="border border-gray-300 p-3">2-3 business days</td>
                        <td className="border border-gray-300 p-3">Same day pickup available</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Shipping Charges */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Shipping Charges</h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <h3 className="text-lg font-semibold text-gray-700">Local Delivery (Within Mumbai/Thane):</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Within 5 km: ₹100</li>
                  <li>5-10 km: ₹200</li>
                  <li>10-15 km: ₹300</li>
                  <li>Express delivery (same day): Additional ₹100</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-700 mt-6">Outstation Delivery:</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Within Maharashtra: ₹200 - ₹350</li>
                  <li>Metro cities: ₹300 - ₹450</li>
                  <li>Other states: ₹400 - ₹600</li>
                  <li>Northeast/Island areas: ₹600 - ₹800</li>
                </ul>

                <div className="bg-amber-50 p-4 rounded-lg mt-6">
                  <p className="text-amber-800 font-semibold">💡 Free Delivery:</p>
                  <p className="text-amber-700">Orders above ₹10,000 qualify for free local delivery within 10 km radius.</p>
                </div>
              </div>
            </motion.div>

            {/* Packaging */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Packaging Standards</h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>We take special care in packaging your garments:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Premium Garment Bags:</strong> All formal wear packed in breathable garment bags</li>
                  <li><strong>Protective Wrapping:</strong> Delicate items wrapped in tissue paper</li>
                  <li><strong>Sturdy Boxes:</strong> Multiple items packed in reinforced boxes</li>
                  <li><strong>Weather Protection:</strong> Waterproof outer packaging for courier deliveries</li>
                  <li><strong>Care Instructions:</strong> Detailed care card included with each garment</li>
                  <li><strong>JMD Branding:</strong> Professional presentation with our branded packaging</li>
                </ul>
              </div>
            </motion.div>

            {/* Delivery Process */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Delivery Process</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Order Completion</h3>
                    <p className="text-gray-600">Final quality check and packaging of your garments</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Delivery Notification</h3>
                    <p className="text-gray-600">SMS/call notification when ready for delivery</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Dispatch</h3>
                    <p className="text-gray-600">Handover to delivery partner with tracking details</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Delivery Confirmation</h3>
                    <p className="text-gray-600">Confirmation call/message upon successful delivery</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Delivery Terms */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Delivery Terms & Conditions</h2>
              
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Address Accuracy:</strong> Please provide complete and accurate delivery address</li>
                  <li><strong>Contact Availability:</strong> Ensure someone is available to receive the delivery</li>
                  <li><strong>ID Verification:</strong> Valid ID may be required for high-value deliveries</li>
                  <li><strong>Delivery Attempts:</strong> Maximum 3 delivery attempts for courier deliveries</li>
                  <li><strong>Inspection Rights:</strong> You may inspect the package before accepting delivery</li>
                  <li><strong>Damage Claims:</strong> Report any damage within 24 hours of delivery</li>
                  <li><strong>Unclaimed Orders:</strong> Orders not collected within 30 days may incur storage charges</li>
                </ul>
              </div>
            </motion.div>

            {/* Special Delivery Services */}
            <motion.div className="mb-12" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Special Delivery Services</h2>
              
              <div className="space-y-6">
                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚡ Express Delivery</h3>
                  <ul className="list-disc list-inside space-y-2 text-yellow-700">
                    <li>Same-day delivery for urgent requirements</li>
                    <li>Available within 15 km radius</li>
                    <li>Additional charges: ₹200 - ₹500</li>
                    <li>Subject to availability and time constraints</li>
                  </ul>
                </div>

                <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
                  <h3 className="text-lg font-semibold text-pink-800 mb-3">💒 Wedding Delivery</h3>
                  <ul className="list-disc list-inside space-y-2 text-pink-700">
                    <li>Scheduled delivery on your special day</li>
                    <li>White-glove delivery service</li>
                    <li>Final fitting at delivery location (if required)</li>
                    <li>Premium packaging and presentation</li>
                  </ul>
                </div>

                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                  <h3 className="text-lg font-semibold text-indigo-800 mb-3">🏢 Bulk Delivery</h3>
                  <ul className="list-disc list-inside space-y-2 text-indigo-700">
                    <li>Corporate and bulk order deliveries</li>
                    <li>Scheduled delivery slots</li>
                    <li>Individual packaging for each garment</li>
                    <li>Dedicated delivery executive</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Contact for Delivery */}
            <motion.div className="mb-8" variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Delivery Support</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>For delivery-related queries or to schedule a delivery, contact us:</p>
                <div className="bg-amber-50 p-6 rounded-xl">
                  <p><strong>JAI MATA DI STITCHING</strong></p>
                  <p>108, Infinity Business Park, Dombivali East, Maharashtra</p>
                  <p>Phone: +91 797 288 9376</p>
                  <p>Email: info@jmdtailors.com</p>
                  <p className="mt-4 text-sm text-gray-500">
                    <strong>Delivery Hours:</strong> Monday - Saturday: 10:00 AM - 7:00 PM<br/>
                    <strong>Sunday:</strong> 11:00 AM - 5:00 PM (Local delivery only)
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Important Notes */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 font-serif">Important Notes</h2>
              <div className="bg-gray-50 p-6 rounded-xl space-y-3 text-gray-600">
                <p>• Delivery charges are calculated based on actual distance and weight</p>
                <p>• Rush delivery subject to availability and production schedule</p>
                <p>• Weather conditions may affect delivery timelines</p>
                <p>• We are not responsible for delays due to incorrect addresses</p>
                <p>• Insurance coverage available for high-value deliveries</p>
                <p>• Delivery charges are non-refundable once dispatch is initiated</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ShippingPolicy; 