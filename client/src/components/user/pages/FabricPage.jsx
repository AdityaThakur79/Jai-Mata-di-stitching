import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Search, Filter, Grid, List, Star, Heart, ShoppingBag } from 'lucide-react';

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
    secondaryFabricImage: '/images/formal2.jpeg',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
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
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-80 bg-white border border-gray-200 p-6 sticky top-8 h-fit transition-all duration-300`}>
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
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
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
                    <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
                      {fabric.isNew && (
                        <span className="bg-black text-white text-xs px-2 py-1 font-medium tracking-wide">NEW</span>
                      )}
                      {fabric.isBestseller && (
                        <span className="bg-gray-800 text-white text-xs px-2 py-1 font-medium tracking-wide">BESTSELLER</span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(fabric._id)}
                      className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-white transition-all border border-gray-200"
                    >
                      <Heart
                        size={16}
                        className={`${favorites.has(fabric._id) ? 'fill-black text-black' : 'text-gray-500'} transition-colors`}
                      />
                    </button>

                    {/* Image Container */}
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-32' : 'w-full aspect-[4/5]'}`}>
                      <img
                        src={fabric.fabricImage}
                        alt={fabric.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
                      />
                      <img
                        src={fabric.secondaryFabricImage}
                        alt={fabric.name + ' alternate'}
                        className="w-full h-full object-cover absolute top-0 left-0 transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className={`${viewMode === 'list' ? 'flex-1' : 'p-5'}`}>
                      <div className="mb-3">
                        <h3 className="text-lg font-medium font-serif mb-1 group-hover:text-black transition-colors">
                          {fabric.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                          <span className="text-sm text-gray-600">{fabric.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-base font-semibold text-gray-900 font-serif">
                          ₹{fabric.price.toLocaleString('en-IN')}
                        </span>
                        {fabric.originalPrice > fabric.price && (
                          <>
                            <span className="text-base font-serif text-gray-600 tracking-wide italic">
                              {fabric.originalPrice > fabric.price && `₹${fabric.originalPrice.toLocaleString('en-IN')}`}
                            </span>
                            <span className="text-sm text-red-600 font-medium">
                              {Math.round((1 - fabric.price / fabric.originalPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Enhanced Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="bg-white border border-gray-200 p-2">
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
      `}</style>
    </div>
  );
};

export default FabricPage;