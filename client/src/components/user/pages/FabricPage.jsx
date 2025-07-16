import React, { useState, useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Search, Filter, Grid, List, Star, Heart, ShoppingBag } from 'lucide-react';
// Remove framer-motion import
// import { motion, useMotionValue, useTransform } from 'framer-motion';

const BRANDS = [
  { label: 'Sadev Fabric', value: 'sadev', count: 230 },
  { label: 'Premium Collection', value: 'premium', count: 145 },
  { label: 'Heritage Textiles', value: 'heritage', count: 89 },
  { label: 'Artisan Crafts', value: 'artisan', count: 67 },
];

const CATEGORIES = [
  { label: 'Formal Wear', value: 'formal', count: 156 },
  { label: 'Casual Wear', value: 'casual', count: 98 },
  { label: 'Traditional', value: 'traditional', count: 134 },
  { label: 'Premium', value: 'premium', count: 67 },
];

const MATERIALS = [
  { label: 'Cotton', value: 'cotton', count: 89 },
  { label: 'Linen', value: 'linen', count: 45 },
  { label: 'Silk', value: 'silk', count: 23 },
  { label: 'Wool', value: 'wool', count: 34 },
  { label: 'Denim', value: 'denim', count: 56 },
];

const staticFabrics = [
  {
    _id: '1',
    name: 'Premium Cotton Twill',
    fabricImage: '/images/balck.png',
    secondaryFabricImage: '/images/menindark.png',
    price: 900,
    originalPrice: 1200,
    rating: 4.8,
    isNew: true,
    isBestseller: false,
  },
  {
    _id: '2',
    name: 'Classic Blue Denim',
    fabricImage: '/images/maroon.png',
    secondaryFabricImage: '/images/menindark.png',
    price: 900,
    originalPrice: 1100,
    rating: 4.6,
    isNew: false,
    isBestseller: true,
  },
  {
    _id: '3',
    name: 'Elegant Linen',
    fabricImage: '/images/balckwithstuc.jpg',
    secondaryFabricImage: '/images/menindark.png',
    price: 900,
    originalPrice: 1050,
    rating: 4.9,
    isNew: false,
    isBestseller: false,
  },
  {
    _id: '4',
    name: 'Soft Flannel',
    fabricImage: '/images/maroon.png',
    secondaryFabricImage: '/images/menindark.png',
    price: 900,
    originalPrice: 950,
    rating: 4.7,
    isNew: false,
    isBestseller: false,
  },
  {
    _id: '5',
    name: 'Premium Jeans',
    fabricImage: '/images/jeans.png',
    secondaryFabricImage: '/images/jeanss2.png',
    price: 1200,
    originalPrice: 1400,
    rating: 4.8,
    isNew: true,
    isBestseller: true,
  },
  {
    _id: '6',
    name: 'Traditional Kurta',
    fabricImage: '/images/kurta1.jpg',
    secondaryFabricImage: '/images/kurta2.jpg',
    price: 1100,
    originalPrice: 1300,
    rating: 4.5,
    isNew: false,
    isBestseller: false,
  },
  {
    _id: '7',
    name: 'Royal Pathani',
    fabricImage: '/images/pathani1.jpg',
    secondaryFabricImage: '/images/pathani2.jpg',
    price: 1300,
    originalPrice: 1500,
    rating: 4.9,
    isNew: false,
    isBestseller: true,
  },
  {
    _id: '8',
    name: 'Executive Shirt',
    fabricImage: '/images/shirts1.jpg',
    secondaryFabricImage: '/images/shirt2.png',
    price: 950,
    originalPrice: 1100,
    rating: 4.6,
    isNew: false,
    isBestseller: false,
  },
  {
    _id: '9',
    name: 'Business Suit',
    fabricImage: '/images/suit1.jpg',
    secondaryFabricImage: '/images/suit2.jpg',
    price: 2000,
    originalPrice: 2500,
    rating: 4.9,
    isNew: true,
    isBestseller: true,
  },
  {
    _id: '10',
    name: 'Formal Trouser',
    fabricImage: '/images/trouser1.jpg',
    secondaryFabricImage: '/images/trouser2.jpg',
    price: 1050,
    originalPrice: 1200,
    rating: 4.7,
    isNew: false,
    isBestseller: false,
  },
  {
    _id: '11',
    name: 'Casual T-Shirt',
    fabricImage: '/images/tshirt.jpg',
    secondaryFabricImage: '/images/tshirt2.webp',
    price: 800,
    originalPrice: 900,
    rating: 4.4,
    isNew: false,
    isBestseller: false,
  },
  {
    _id: '12',
    name: 'Textured Black',
    fabricImage: '/images/balckwithstuc.jpg',
    secondaryFabricImage: '/images/balckwithstuc2.jpg',
    price: 1400,
    originalPrice: 1600,
    rating: 4.8,
    isNew: true,
    isBestseller: false,
  },
  {
    _id: '13',
    name: 'Heritage Jodhpuri',
    fabricImage: '/images/jodh1.png',
    secondaryFabricImage: '/images/jiodh2.jpg',
    price: 2100,
    originalPrice: 2400,
    rating: 4.9,
    isNew: false,
    isBestseller: true,
  },
  {
    _id: '14',
    name: 'JMD Signature',
    fabricImage: '/images/formal1.jpg',
    secondaryFabricImage: '/images/formal2.jpg',
    price: 999,
    originalPrice: 1199,
    rating: 4.6,
    isNew: false,
    isBestseller: false,
  },
];

const FabricPage = () => {
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [modalImage, setModalImage] = useState(null);
  const [modalImages, setModalImages] = useState([]); // [main, secondary]
  const [activeModalIdx, setActiveModalIdx] = useState(0);

  // Remove framer-motion state
  // const [imgHover, setImgHover] = useState(false);
  // const x = useMotionValue(0);
  // const y = useMotionValue(0);
  // const rotateX = useTransform(y, [-50, 50], [12, -12]);
  // const rotateY = useTransform(x, [-50, 50], [-12, 12]);
  // For custom tilt effect
  const [imgTransform, setImgTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const imgRef = useRef(null);
  const handleImgMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 12; // max 12deg
    const rotateX = -((y - centerY) / centerY) * 12; // max 12deg
    setImgTransform({ rotateX, rotateY, scale: 1.04 });
  };
  const handleImgMouseLeave = () => {
    setImgTransform({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  // Filter and paginate static data
  let filteredFabrics = staticFabrics.filter(fabric => {
    const matchesBrand = !brand || brand === 'sadev';
    const matchesPrice = fabric.price >= priceRange[0] && fabric.price <= priceRange[1];
    const matchesSearch = fabric.name.toLowerCase().includes(search.toLowerCase());
    return matchesBrand && matchesPrice && matchesSearch;
  });

  // Sort fabrics
  filteredFabrics.sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return b.isNew - a.isNew;
      default: return a.name.localeCompare(b.name);
    }
  });

  const totalPage = Math.ceil(filteredFabrics.length / limit) || 1;
  const paginatedFabrics = filteredFabrics.slice((page - 1) * limit, page * limit);

  const handlePriceChange = (e, idx) => {
    const val = Number(e.target.value);
    setPriceRange((prev) => idx === 0 ? [val, prev[1]] : [prev[0], val]);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const FilterSection = ({ title, items, selectedValue, onValueChange, showCount = true }) => (
    <div className="mb-8">
      <h3 className="font-semibold text-sm text-gray-900 mb-4 uppercase tracking-wider">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <label key={item.value} className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center space-x-3">
              <Checkbox 
                checked={selectedValue === item.value} 
                onCheckedChange={() => onValueChange(item.value === selectedValue ? '' : item.value)}
                className="border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm text-gray-700 group-hover:text-black transition-colors">{item.label}</span>
            </div>
            {showCount && (
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                {item.count}
              </span>
            )}
          </label>
        ))}
      </div>
    </div>
  );

  // Remove the rating and add a professional tag
  const fabricTags = [
    'Signature', 'Essential', 'Heritage', 'Exclusive',
    'Signature', 'Essential', 'Heritage', 'Exclusive',
    'Signature', 'Essential', 'Heritage', 'Exclusive',
    'Signature', 'Essential'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Premium Fabrics</h1>
              <p className="text-gray-600">Discover our curated collection of luxury textiles</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search fabrics..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 py-3 border border-gray-300 focus:border-black focus:ring-black"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Filter size={20} />
                <span>Filters</span>
              </button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 py-3 border border-gray-300">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
              <Select value={limit.toString()} onValueChange={v => { setLimit(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-32 py-3 border border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[8, 16, 24, 32].map(n => (
                    <SelectItem key={n} value={n.toString()}>{n} / page</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Enhanced Sidebar Filters */}
          {/* Mobile Filter Modal */}
          {showFilters && (
            <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 lg:hidden" style={{top: '80px'}} onClick={() => setShowFilters(false)}>
               <aside className="w-full h-[calc(100vh-80px)] bg-white border-l border-gray-200 p-2 overflow-y-auto relative animate-slideInRight" style={{width: '100vw', maxWidth: '100vw', minWidth: 0, padding: '0.5rem'}} onClick={e => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold" onClick={() => setShowFilters(false)}>&times;</button>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Filters</h2>
                  <div className="w-12 h-0.5 bg-black"></div>
                </div>
                <FilterSection
                  title="Brand"
                  items={BRANDS}
                  selectedValue={brand}
                  onValueChange={setBrand}
                />
                <FilterSection
                  title="Category"
                  items={CATEGORIES}
                  selectedValue={category}
                  onValueChange={setCategory}
                />
                <FilterSection
                  title="Material"
                  items={MATERIALS}
                  selectedValue={material}
                  onValueChange={setMaterial}
                />
                <div className="mb-8">
                  <h3 className="font-semibold text-sm text-gray-900 mb-4 uppercase tracking-wider">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Min</label>
                        <Input
                          type="number"
                          min={0}
                          max={priceRange[1]}
                          value={priceRange[0]}
                          onChange={e => handlePriceChange(e, 0)}
                          className="border-gray-300 focus:border-black focus:ring-black"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Max</label>
                        <Input
                          type="number"
                          min={priceRange[0]}
                          max={100000}
                          value={priceRange[1]}
                          onChange={e => handlePriceChange(e, 1)}
                          className="border-gray-300 focus:border-black focus:ring-black"
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min={0}
                        max={5000}
                        value={priceRange[1]}
                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full h-2 bg-gray-200 appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setBrand('');
                      setCategory('');
                      setMaterial('');
                      setPriceRange([0, 50000]);
                      setSearch('');
                    }}
                    className="w-full py-3 text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </aside>
            </div>
          )}
          {/* Desktop Sidebar Filters */}
          <aside className={`hidden lg:block w-80 bg-white border border-gray-200 p-6 sticky top-8 h-fit transition-all duration-300`}>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Filters</h2>
              <div className="w-12 h-0.5 bg-black"></div>
            </div>

            <FilterSection
              title="Brand"
              items={BRANDS}
              selectedValue={brand}
              onValueChange={setBrand}
            />

            <FilterSection
              title="Category"
              items={CATEGORIES}
              selectedValue={category}
              onValueChange={setCategory}
            />

            <FilterSection
              title="Material"
              items={MATERIALS}
              selectedValue={material}
              onValueChange={setMaterial}
            />

            <div className="mb-8">
              <h3 className="font-semibold text-sm text-gray-900 mb-4 uppercase tracking-wider">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Min</label>
                    <Input
                      type="number"
                      min={0}
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={e => handlePriceChange(e, 0)}
                      className="border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Max</label>
                    <Input
                      type="number"
                      min={priceRange[0]}
                      max={100000}
                      value={priceRange[1]}
                      onChange={e => handlePriceChange(e, 1)}
                      className="border-gray-300 focus:border-black focus:ring-black"
                    />
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full h-2 bg-gray-200 appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setBrand('');
                  setCategory('');
                  setMaterial('');
                  setPriceRange([0, 50000]);
                  setSearch('');
                }}
                className="w-full py-3 text-sm text-gray-600 hover:text-black transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {paginatedFabrics.length} of {filteredFabrics.length} fabrics
              </p>
            </div>

            {/* Fabric Grid */}
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3' : 'grid-cols-1'} md:gap-8`}>
              {paginatedFabrics.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <div className="text-gray-400 mb-4">
                    <ShoppingBag size={48} className="mx-auto mb-4" />
                    <p className="text-xl font-medium">No fabrics found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                  </div>
                </div>
              ) : (
                paginatedFabrics.map((fabric, index) => (
                  <div
                    key={fabric._id}
                    className={`group relative bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden ${viewMode === 'list' ? 'flex items-center space-x-6 p-6' : ''}`}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    {/* Badges */}
                    {/* Removed NEW and BESTSELLER tags */}

                    {/* Eye Icon Button - minimal, no circle or background */}
                    <button
                      className="absolute top-3 right-3 z-10 p-1 bg-transparent border-none shadow-none focus:outline-none hover:text-black transition-colors"
                      style={{ border: 'none', background: 'none', borderRadius: 0 }}
                      onClick={e => {
                        e.stopPropagation();
                        setModalImages([fabric.fabricImage, fabric.secondaryFabricImage]);
                        setActiveModalIdx(0);
                        setModalImage(true);
                      }}
                      aria-label="View larger image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-500 group-hover:text-black transition-colors" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>

                    {/* Image Container */}
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-32' : 'w-full aspect-[4/5]'}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={fabric.fabricImage}
                        alt={fabric.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
                        style={{ cursor: 'pointer' }}
                      />
                      <img
                        src={fabric.secondaryFabricImage}
                        alt={fabric.name + ' alternate'}
                        className="w-full h-full object-cover absolute top-0 left-0 transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                        style={{ cursor: 'pointer' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className={`${viewMode === 'list' ? 'flex-1' : 'p-5'}`}>
                      <div className="mb-3">
                        <h3 className="text-lg font-medium font-serif mb-1 group-hover:text-black transition-colors">
                          {fabric.name}
                        </h3>
                        {/* Professional Tag */}
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 border border-gray-200 mb-1">
                          {fabricTags[(page - 1) * limit + index] || 'Signature'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-base font-semibold text-gray-900 font-serif">
                          ₹{fabric.price.toLocaleString('en-IN')}
                        </span>
                        {/* Removed discounted/original price and discount percentage */}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Enhanced Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="bg-white border border-gray-200 p-2 w-full overflow-x-auto flex justify-center" style={{maxWidth: '100vw'}}>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="hover:bg-black hover:text-white transition-colors"
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(totalPage, 5) }).map((_, i) => {
                      const pageNumber = page <= 3 ? i + 1 : page - 2 + i;
                      return pageNumber <= totalPage ? (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            isActive={page === pageNumber}
                            onClick={() => setPage(pageNumber)}
                            className="hover:bg-black hover:text-white transition-colors"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ) : null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(p => Math.min(totalPage, p + 1))}
                        className="hover:bg-black hover:text-white transition-colors"
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal for enlarged image with thumbnails */}
      {modalImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setModalImage(null)}>
          <div className="relative flex flex-col sm:flex-row items-center justify-center"
            style={{ maxWidth: '420px', width: '100%', maxHeight: '90vh', background: 'none', boxShadow: 'none', padding: 0 }}
            onClick={e => e.stopPropagation()}>
            {/* Close icon - plain, floating, no circle */}
            <button
              className="absolute -top-6 right-0 text-white text-4xl font-bold shadow-lg hover:text-gray-300 transition-all z-20"
              style={{ background: 'none', border: 'none', lineHeight: 1, padding: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
              onClick={() => setModalImage(null)}
              aria-label="Close"
            >
              &times;
            </button>
            {/* Thumbnails - close to main image */}
            <div className="flex sm:flex-col flex-row gap-2 sm:mr-3 mb-2 sm:mb-0 z-10">
              {modalImages.map((img, idx) => (
                <img
                  key={img}
                  src={img}
                  alt={`Thumbnail ${idx+1}`}
                  className={`w-14 h-14 object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 ${activeModalIdx === idx ? 'border-black shadow-lg' : 'border-gray-200 opacity-80 hover:opacity-100'}`}
                  onClick={() => setActiveModalIdx(idx)}
                  style={{ background: '#fff' }}
                />
              ))}
            </div>
            {/* Main Preview with custom tilt effect */}
            <div className="flex-1 flex flex-col items-center">
              <img
                ref={imgRef}
                src={modalImages[activeModalIdx]}
                alt="Enlarged fabric preview"
                className="shadow-3d object-cover bg-white"
                style={{
                  width: '320px', // fixed width
                  height: '420px', // fixed height
                  maxWidth: '90vw',
                  maxHeight: '80vh',
                  minWidth: '200px',
                  minHeight: '200px',
                  background: 'none',
                  objectFit: 'cover', // ensure image covers the area
                  display: 'block',
                  margin: '0 auto',
                  transform: `perspective(900px) rotateX(${imgTransform.rotateX}deg) rotateY(${imgTransform.rotateY}deg) scale(${imgTransform.scale})`,
                  zIndex: 20,
                  transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)', // super smooth
                }}
                onMouseMove={handleImgMouseMove}
                onMouseLeave={handleImgMouseLeave}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #000;
          cursor: pointer;
          border-radius: 50%;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #000;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
        @media (max-width: 640px) {
          .grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .max-w-7xl {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          .p-6 {
            padding: 1rem !important;
          }
          .p-4 {
            padding: 0.75rem !important;
          }
          .mb-8 {
            margin-bottom: 1.5rem !important;
          }
          .py-8 {
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }
          .gap-8 {
            gap: 1rem !important;
          }
          .gap-4 {
            gap: 0.5rem !important;
          }
          .w-80 {
            width: 100% !important;
          }
          .sticky {
            position: static !important;
          }
          .pagination-content {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .w-full {
            width: 100% !important;
          }
          .max-w-xs {
            max-width: 100vw !important;
          }
        }
        @media (max-width: 400px) {
          .p-2 {
            padding: 0.25rem !important;
          }
          .pagination-content {
            flex-wrap: wrap;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FabricPage;