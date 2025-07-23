import React, { useState } from 'react'
import { motion } from 'framer-motion';

const Testimonials = () => {
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

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      };
    
      const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      };
    
      // Animation variants
      const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
      };
    
      const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.7 } }
      };
  return (
    <div>
         <motion.div className="py-20 px-4 bg-white" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 font-serif">
              CLIENT TESTIMONIALS
            </h2>
            <h3 className="text-3xl md:text-5xl font-light text-gray-800 mb-6 font-serif leading-tight">
              What Our Customers Say
            </h3>
            <div className="w-16 h-0.5 bg-amber-600 mx-auto"></div>
          </div>
          <motion.div
            className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            key={currentTestimonial}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              key={currentTestimonial}
            >
              <img
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
                className="w-20 h-20 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-lg"
              />
              <div className="text-4xl text-amber-600 mb-4">"</div>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 font-light italic">
                {testimonials[currentTestimonial].text}
              </p>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 font-serif">
                  {testimonials[currentTestimonial].name}
                </h4>
                <p className="text-sm text-amber-600 uppercase tracking-wider">
                  {testimonials[currentTestimonial].occasion}
                </p>
              </div>
            </motion.div>
            {/* Navigation */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Previous testimonial"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label="Next testimonial"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            {/* Dots indicator */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                    index === currentTestimonial ? 'bg-amber-600' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

    </div>
  )
}

export default Testimonials
