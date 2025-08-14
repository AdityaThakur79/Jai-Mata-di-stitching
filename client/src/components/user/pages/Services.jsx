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
  Palette,
  Loader2
} from 'lucide-react';
import { BlurFade } from '@/components/magicui/blur-fade';
import CTA from '../CTA';
import { useGetAllServicesQuery } from '@/features/api/serviceApi';
import { useCreateEnquiryMutation } from '@/features/api/enquiryApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper function to get icon based on category
const getCategoryIcon = (category) => {
  const iconMap = {
    'Formal Wear': <Shirt className="w-6 h-6" />,
    'Traditional Wear': <Crown className="w-6 h-6" />,
    'Office Wear': <User className="w-6 h-6" />,
    'Ethnic Wear': <Sparkles className="w-6 h-6" />,
    'Cultural Wear': <Users className="w-6 h-6" />,
    'Casual Wear': <Scissors className="w-6 h-6" />,
    'Corporate Wear': <Gem className="w-6 h-6" />,
    'Bridal Wear': <Heart className="w-6 h-6" />,
    'Alterations': <CheckCircle className="w-6 h-6" />,
    'default': <Star className="w-6 h-6" />
  };
  return iconMap[category] || iconMap['default'];
};

// Helper function to format price
const formatPrice = (pricing) => {
  if (!pricing) return 'Contact for Price';
  
  const { basePrice, maxPrice, priceType } = pricing;
  
  switch (priceType) {
    case 'fixed':
      return `₹${basePrice}`;
    case 'starting_from':
      return `From ₹${basePrice}`;
    case 'range':
      return `₹${basePrice} - ₹${maxPrice || basePrice}`;
    case 'custom_quote':
      return 'Custom Quote';
    default:
      return `From ₹${basePrice}`;
  }
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
  
  // Enquiry modal state
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    serviceId: '',
    serviceName: '',
    message: ''
  });

  // Fetch services from API
  const { data, isLoading, error } = useGetAllServicesQuery({
    page: 1,
    limit: 100, // Get all services for display
    status: 'active' // Only show active services
  });

  const services = data?.services || [];

  // Enquiry mutation
  const [createEnquiry, { isLoading: isSubmitting }] = useCreateEnquiryMutation();

  // Force re-render when tab changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [activeTab, selectedCategory]);

  // Get unique categories for the active tab
  const getCategories = (tab) => {
    const tabServices = services.filter(service => service.gender === tab);
    const categories = [...new Set(tabServices.map(service => service.category))];
    return ['all', ...categories];
  };

  // Filter services based on active tab and category
  const currentServices = services.filter(service => service.gender === activeTab);
  const filteredServices = currentServices.filter(service => 
    selectedCategory === 'all' || service.category === selectedCategory
  );

  // Handle get quote click
  const handleGetQuote = (service) => {
    setSelectedService(service);
    setEnquiryForm({
      name: '',
      email: '',
      phoneNumber: '',
      serviceId: service._id,
      serviceName: service.title,
      message: `I'm interested in ${service.title}. Please provide me with a quote.`
    });
    setShowEnquiryModal(true);
  };

  // Handle form input change
  const handleInputChange = (field, value) => {
    setEnquiryForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!enquiryForm.name.trim() || !enquiryForm.phoneNumber.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createEnquiry({
        name: enquiryForm.name.trim(),
        email: enquiryForm.email.trim(),
        phoneNumber: enquiryForm.phoneNumber.trim(),
        serviceId: enquiryForm.serviceId,
        serviceName: enquiryForm.serviceName,
        message: enquiryForm.message.trim(),
        source: 'services_page'
      }).unwrap();

      toast.success('Your enquiry has been submitted successfully! We will contact you soon.');
      
      // Reset form and close modal
      setEnquiryForm({
        name: '',
        email: '',
        phoneNumber: '',
        serviceId: '',
        serviceName: '',
        message: ''
      });
      setShowEnquiryModal(false);
      setSelectedService(null);
    } catch (error) {
      console.error('Enquiry submission error:', error);
      toast.error(error?.data?.message || 'Failed to submit enquiry. Please try again.');
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  const staggerChildren = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <>
      <style>{`
        .service-card-image {
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .service-card:hover .service-card-image.primary {
          opacity: 0;
          transform: scale(1.1);
        }
        
        .service-card:hover .service-card-image.secondary {
          opacity: 1;
          transform: scale(1.1);
        }
        
        .service-card .service-card-image.secondary {
          opacity: 0;
          transform: scale(1);
        }
      `}</style>
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Hero Header Section */}
      <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh] flex items-center justify-center text-center text-white overflow-hidden mb-8 sm:mb-12 mt-[80px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/tailor.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
        {/* Breadcrumbs */}
        <nav
          className="absolute top-12 sm:top-12 md:top-12  left-1/2 -translate-x-1/2 z-20"
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
                {['men', 'women', 'unisex'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setSelectedCategory('all');
                    }}
                    className={`px-4 md:px-6 py-3 md:py-4 rounded-xl font-semibold text-sm md:text-base tracking-wide uppercase transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    {tab === 'men' ? "Men's Services" : 
                     tab === 'women' ? "Women's Services" : 
                     "Unisex Services"}
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
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading our amazing services...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg">Failed to load services. Please try again later.</p>
              </div>
            ) : filteredServices.length > 0 ? (
              <div key={`grid-${activeTab}-${selectedCategory}-${forceUpdate}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredServices.map((service, index) => (
              <div
                key={`${activeTab}-${service._id}-${selectedCategory}-${forceUpdate}`}
                className="service-card group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-100 hover:border-amber-300 hover:-translate-y-2 hover:scale-[1.02]"
              >
                {/* Service Image with Hover Effect */}
                <div className="relative h-64 md:h-72 overflow-hidden">
                  {/* Primary Image */}
                  <img
                    src={service.serviceImage || '/images/tailor.png'}
                    alt={service.title}
                    className={`service-card-image primary w-full h-full object-cover ${
                      !service.secondaryServiceImage && 'group-hover:scale-110'
                    }`}
                    onError={(e) => {
                      e.target.src = '/images/tailor.png'; // Fallback image
                    }}
                  />
                  
                  {/* Secondary Image (shown on hover) */}
                  {service.secondaryServiceImage && (
                    <img
                      src={service.secondaryServiceImage}
                      alt={`${service.title} - Alternative view`}
                      className="service-card-image secondary absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'; // Hide if secondary image fails
                      }}
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {/* Category Badge */}
                    <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {service.category}
                    </div>
                    {/* Popular/Featured Badges */}
                    {service.isPopular && (
                      <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Popular
                      </div>
                    )}
                    {service.isFeatured && (
                      <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </div>
                    )}
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                    {formatPrice(service.pricing)}
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-600 mr-4">
                      {getCategoryIcon(service.category)}
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-semibold text-gray-800 font-serif group-hover:text-amber-700 transition-colors duration-300">
                        {service.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.estimatedDays} days
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 font-light leading-relaxed">
                    {service.shortDescription || service.description}
                  </p>

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                  <div className="space-y-2 mb-6">
                      {service.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                      {service.features.length > 3 && (
                        <div className="text-xs text-gray-500 italic">
                          +{service.features.length - 3} more features
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {service.tags && service.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {service.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                  </div>
                  )}

                  {/* CTA Button */}
                  <button 
                    onClick={() => handleGetQuote(service)}
                    className="w-full border-2 px-4 py-3 text-base font-serif tracking-wider shadow-md transition-all duration-300 uppercase"
                    style={{ 
                      borderRadius: 0, 
                      background: '#e3b873', 
                      color: '#222', 
                      borderColor: '#e3b873' 
                    }}
                    onMouseOver={e => { 
                      e.currentTarget.style.background = '#222'; 
                      e.currentTarget.style.color = '#e3b873'; 
                      e.currentTarget.style.borderColor = '#222'; 
                    }}
                    onMouseOut={e => { 
                      e.currentTarget.style.background = '#e3b873'; 
                      e.currentTarget.style.color = '#222'; 
                      e.currentTarget.style.borderColor = '#e3b873'; 
                    }}
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
            </div>
                      ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No services found for the selected category.</p>
                {services.length === 0 && !isLoading && (
                  <p className="text-gray-400 text-sm mt-2">Our services are being updated. Please check back soon!</p>
                )}
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

      {/* Enquiry Modal */}
      <Dialog open={showEnquiryModal} onOpenChange={setShowEnquiryModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-gray-800">
              Get Quote for {selectedService?.title}
            </DialogTitle>
            <button
              onClick={() => setShowEnquiryModal(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          
          <form onSubmit={handleSubmitEnquiry} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={enquiryForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={enquiryForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={enquiryForm.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select 
                value={enquiryForm.serviceId} 
                onValueChange={(value) => {
                  const service = services.find(s => s._id === value);
                  handleInputChange('serviceId', value);
                  handleInputChange('serviceName', service?.title || '');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service._id} value={service._id}>
                      {service.title} - {formatPrice(service.pricing)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                placeholder="Tell us more about your requirements..."
                value={enquiryForm.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border border-input bg-background rounded-md resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEnquiryModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 border-2 px-4 py-2 text-sm font-serif tracking-wider shadow-md transition-all duration-300 uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                style={{ 
                  borderRadius: 0, 
                  background: '#e3b873', 
                  color: '#222', 
                  borderColor: '#e3b873' 
                }}
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
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Get Quote'
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
};

export default ServicesPage; 