import React from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Home, Video } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const BookAppointment = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: "Book Visit At Your Comfort",
      subtitle: "Home Service Excellence",
      description: "Design your outfit with ease with expert Fashion Designers at your doorstep",
      features: [
        "Expert fashion designers visit your location",
        "Complete measurement and consultation",
        "Fabric selection assistance",
        "Design customization on-site",
        "Convenient scheduling"
      ],
      image: "/images/formal1.jpg",
      icon: Home,
      buttonText: "Book a home visit",
      color: "from-amber-600 to-orange-600"
    },
    {
      id: 2,
      title: "Consult with e-Designers",
      subtitle: "Virtual Design Studio",
      description: "Consult with your personal fashion designer today",
      features: [
        "Virtual consultation sessions",
        "Digital design mockups",
        "Online fabric catalog browsing",
        "Real-time design modifications",
        "Flexible appointment timing"
      ],
      image: "/images/formal2.jpg",
      icon: Video,
      buttonText: "Book a e-Designer",
      color: "from-emerald-600 to-teal-600"
    }
  ];

  return (
    <div>
          <section className="py-20 relative z-10  bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 relative">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            
            <h2 className="text-xs font-bold text-amber-600 tracking-[0.3em] uppercase mb-4 font-serif">
              CHOOSE YOUR EXPERIENCE
            </h2>
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-6 font-serif leading-tight">
              Tailored to Your
              <br />
              <span className="text-amber-600 font-medium italic">Lifestyle</span>
            </h1>
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-px bg-amber-300"></div>
              <div className="mx-4 w-3 h-3 bg-amber-400 rounded-full"></div>
              <div className="w-12 h-px bg-amber-300"></div>
            </div>
          </motion.div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="group relative bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-amber-200/40 transition-all duration-500 hover:shadow-3xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                {/* Background Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Service Icon */}
                  <div className="absolute top-6 right-6">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20"
                      style={{ background: 'rgba(227, 184, 115, 0.9)' }}
                    >
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-2xl lg:text-3xl font-light font-serif mb-2">
                      {service.title}
                    </h3>
                    <p className="text-amber-200 font-medium mb-4 text-lg">
                      {service.subtitle}
                    </p>
                    <p className="text-white/90 font-light leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="p-8">
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: '#e3b873' }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 font-light">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.button
                    className="group/btn w-full relative inline-flex items-center justify-center px-8 py-4 text-white font-medium rounded-xl shadow-lg transition-all duration-300 ease-out overflow-hidden"
                    style={{ background: '#e3b873' }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/contact')}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center space-x-2">
                      <span>{service.buttonText}</span>
                      <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default BookAppointment
