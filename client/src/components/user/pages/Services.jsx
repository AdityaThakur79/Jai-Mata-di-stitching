import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shirt, 
  Scissors, 
  Crown, 
  Sparkles, 
  Users, 
  Clock,
  Star,
  CheckCircle,
  User,
  Ruler,
  PackageCheck,
  Heart,
  Gem,
  Palette
} from 'lucide-react';
import { BlurFade } from '@/components/magicui/blur-fade';
import CTA from '../CTA';

// Services data separated by category
const servicesData = {
  men: [
    {
      id: 1,
      image: '/images/suit1.jpg',
      title: 'Premium Business Suits',
      description: 'Tailored suits for the modern professional',
      category: 'Formal Wear',
      price: 'From ₹15,000',
      duration: '7-10 days',
      features: ['Perfect fit guarantee', 'Premium fabrics', 'Multiple fittings'],
      icon: <Shirt className="w-6 h-6" />
    },
    {
      id: 2,
      image: '/images/jiodh2.jpg',
      title: 'Royal Jodhpuri Suits',
      description: 'Traditional royal attire with modern elegance',
      category: 'Traditional Wear',
      price: 'From ₹12,000',
      duration: '5-7 days',
      features: ['Handcrafted details', 'Royal styling', 'Custom embroidery'],
      icon: <Crown className="w-6 h-6" />
    },
    {
      id: 3,
      image: '/images/formal1.jpg',
      title: 'Formal Shirts & Trousers',
      description: 'Crisp shirts and perfectly fitted trousers',
      category: 'Office Wear',
      price: 'From ₹3,500',
      duration: '3-5 days',
      features: ['Wrinkle-free fabric', 'Comfort fit', 'Professional styling'],
      icon: <User className="w-6 h-6" />
    },
    {
      id: 4,
      image: '/images/kurta1.jpg',
      title: 'Traditional Kurtas',
      description: 'Elegant kurtas for festivals and occasions',
      category: 'Ethnic Wear',
      price: 'From ₹2,500',
      duration: '4-6 days',
      features: ['Pure cotton', 'Traditional cuts', 'Comfortable fit'],
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      id: 5,
      image: '/images/pathani1.jpg',
      title: 'Pathani Suits',
      description: 'Classic Pathani suits with cultural authenticity',
      category: 'Cultural Wear',
      price: 'From ₹4,000',
      duration: '5-7 days',
      features: ['Authentic design', 'Premium cotton', 'Traditional styling'],
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 6,
      image: '/images/jeans.png',
      title: 'Custom Denim',
      description: 'Perfectly fitted jeans and casual wear',
      category: 'Casual Wear',
      price: 'From ₹2,800',
      duration: '4-6 days',
      features: ['Perfect fit', 'Quality denim', 'Modern cuts'],
      icon: <Scissors className="w-6 h-6" />
    }
  ],
  women: [
    {
      id: 7,
      image: '/images/formal2.jpg',
      title: 'Professional Blazers',
      description: 'Elegant blazers for the modern businesswoman',
      category: 'Corporate Wear',
      price: 'From ₹8,000',
      duration: '6-8 days',
      features: ['Tailored fit', 'Premium fabrics', 'Professional styling'],
      icon: <Gem className="w-6 h-6" />
    },
    {
      id: 8,
      image: '/images/wedding.png',
      title: 'Wedding Lehengas',
      description: 'Stunning bridal and wedding occasion wear',
      category: 'Bridal Wear',
      price: 'From ₹25,000',
      duration: '15-20 days',
      features: ['Custom embroidery', 'Luxury fabrics', 'Bridal styling'],
      icon: <Heart className="w-6 h-6" />
    },
    {
      id: 9,
      image: '/images/kurta2.jpg',
      title: 'Designer Kurtis',
      description: 'Contemporary kurtis with traditional elegance',
      category: 'Ethnic Wear',
      price: 'From ₹3,000',
      duration: '4-6 days',
      features: ['Modern designs', 'Comfortable fit', 'Quality fabrics'],
      icon: <Palette className="w-6 h-6" />
    },
    {
      id: 10,
      image: '/images/womensection.jpeg',
      title: 'Formal Dresses',
      description: 'Sophisticated dresses for special occasions',
      category: 'Formal Wear',
      price: 'From ₹6,500',
      duration: '7-10 days',
      features: ['Elegant cuts', 'Perfect fit', 'Premium styling'],
      icon: <Star className="w-6 h-6" />
    },
    {
      id: 11,
      image: '/images/trouser2.jpg',
      title: 'Tailored Trousers',
      description: 'Professional trousers with perfect fit',
      category: 'Office Wear',
      price: 'From ₹3,500',
      duration: '3-5 days',
      features: ['Comfort fit', 'Professional styling', 'Quality fabrics'],
      icon: <Ruler className="w-6 h-6" />
    },
    {
      id: 12,
      image: '/images/alteratin.png',
      title: 'Dress Alterations',
      description: 'Expert alterations for perfect fit',
      category: 'Alterations',
      price: 'From ₹800',
      duration: '2-3 days',
      features: ['Expert tailoring', 'Quick service', 'Perfect adjustments'],
      icon: <CheckCircle className="w-6 h-6" />
    }
  ]
};

// Process steps
const processSteps = [
  {
    icon: <User className="w-8 h-8 text-amber-600" />,
    title: 'Consultation',
    description: 'Discuss your requirements and style preferences'
  },
  {
    icon: <Ruler className="w-8 h-8 text-amber-600" />,
    title: 'Measurements',
    description: 'Precise measurements for perfect fit'
  },
  {
    icon: <Scissors className="w-8 h-8 text-amber-600" />,
    title: 'Crafting',
    description: 'Expert tailoring with attention to detail'
  },
  {
    icon: <PackageCheck className="w-8 h-8 text-amber-600" />,
    title: 'Delivery',
    description: 'Final fitting and delivery of your garment'
  }
];

const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState('men');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force re-render when tab changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [activeTab, selectedCategory]);

  // Get unique categories for the active tab
  const getCategories = (tab) => {
    const categories = [...new Set(servicesData[tab].map(service => service.category))];
    return ['all', ...categories];
  };

  // Filter services based on active tab and category
  const currentServices = servicesData[activeTab] || [];
  const filteredServices = currentServices.filter(service => 
    selectedCategory === 'all' || service.category === selectedCategory
  );

  // Debug logging
  console.log('Current activeTab:', activeTab);
  console.log('Current selectedCategory:', selectedCategory);
  console.log('Available services for tab:', currentServices);
  console.log('Filtered services:', filteredServices);
  console.log('Filtered services length:', filteredServices.length);
  console.log('Force update counter:', forceUpdate);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50  ">
      {/* Hero Header Section */}
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
            <li className="text-amber-200 font-semibold">Services</li>
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
            Expert Tailoring Services at JMD Stitching only
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 font-light drop-shadow mt-1 sm:mt-2 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Discover our comprehensive range of tailoring services, crafted with precision, passion, and years of experience for both men and women.
          </motion.p>
        </motion.div>
      </div>

      {/* Services Section */}
      <motion.section 
        key={activeTab}
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 md:mb-6 font-serif">
              TAILORING SERVICES
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-6 md:mb-8 font-serif leading-tight">
              Crafted Just For You
            </h3>
            <div className="flex justify-center mb-8 md:mb-12">
              <div className="flex items-center space-x-3">
                <div className="w-12 md:w-16 h-px bg-amber-300"></div>
                <div className="w-4 h-4 md:w-5 md:h-5 bg-amber-400 rounded-full animate-pulse"></div>
                <div className="w-12 md:w-16 h-px bg-amber-300"></div>
              </div>
            </div>
          </div>

          {/* Toggle Tabs */}
          <div className="flex justify-center mb-12 md:mb-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-amber-100">
              <div className="flex space-x-2">
                {['men', 'women'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setSelectedCategory('all');
                    }}
                    className={`px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base tracking-wide uppercase transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    {tab === 'men' ? "Men's Services" : "Women's Services"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 md:mb-16">
            {getCategories(activeTab).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                    : 'bg-white/50 text-gray-600 border border-gray-200 hover:bg-amber-50 hover:text-amber-600'
                }`}
              >
                {category === 'all' ? 'All Services' : category}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="min-h-[400px]">
            {filteredServices.length > 0 ? (
              <div key={`grid-${activeTab}-${selectedCategory}-${forceUpdate}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredServices.map((service, index) => (
              <div
                key={`${activeTab}-${service.id}-${selectedCategory}-${forceUpdate}`}
                className="group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-100 hover:border-amber-300 hover:-translate-y-2 hover:scale-[1.02]"
              >
                {/* Service Image */}
                <div className="relative h-64 md:h-72 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = '/images/tailor.png'; // Fallback image
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {service.category}
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                    {service.price}
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-600 mr-4">
                      {service.icon}
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-semibold text-gray-800 font-serif group-hover:text-amber-700 transition-colors duration-300">
                        {service.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 font-light leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-[1.02]">
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
            </div>
                      ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No services found for the selected category.</p>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Process Section */}
      <motion.section 
        className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 md:mb-6 font-serif">
              OUR PROCESS
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-6 md:mb-8 font-serif leading-tight">
              How We Work
            </h3>
            <div className="flex justify-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 md:w-16 h-px bg-amber-300"></div>
                <div className="w-4 h-4 md:w-5 md:h-5 bg-amber-400 rounded-full animate-pulse"></div>
                <div className="w-12 md:w-16 h-px bg-amber-300"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center group"
                variants={fadeInUp}
                whileHover={{ y: -8 }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-amber-200 group-hover:border-amber-400">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 font-serif group-hover:text-amber-700 transition-colors duration-300">
                  {step.title}
                </h4>
                <p className="text-gray-600 font-light leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <CTA />
    </div>
  );
};

export default ServicesPage; 