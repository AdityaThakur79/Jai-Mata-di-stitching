import React from 'react';
import { useGetAllItemMastersQuery } from '@/features/api/itemApi';
import SectionOverlay from './SectionOverlay';

const UnisexItems = () => {
  const { data, isLoading, isError } = useGetAllItemMastersQuery({ page: 1, limit: 12, category: 'unisex' });
  const items = (data?.items || []).slice(0, 4);

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (isError) {
    return <div className="text-center py-12 text-red-500">Failed to load items.</div>;
  }

  return (
    <section className="relative py-8 sm:py-12 bg-white">
      {/* Modern Overlays */}
      <SectionOverlay position="top-left" size="38%" opacity={0.18} />
      <SectionOverlay position="top-right" size="32%" opacity={0.16} />
      <SectionOverlay position="bottom-left" size="28%" opacity={0.14} />
      <SectionOverlay position="bottom-right" size="36%" opacity={0.17} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <h2 className="text-2xl sm:text-3xl text-center mb-4 sm:mb-6">Unisex Collection</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {items.map((item) => (
            <div key={item._id} className="flex flex-col items-center">
              <div className="relative w-full aspect-[3/4] overflow-hidden group rounded-sm shadow-lg">
                <img
                  src={item.itemImage || '/images/placeholder.png'}
                  alt={item.name}
                  className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:opacity-0"
                  style={{ willChange: 'transform, opacity' }}
                />
                {/* Overlay for transition */}
                <div
                  className="absolute top-0 left-0 w-full h-full pointer-events-none transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-80"
                  style={{ background: 'rgba(227, 184, 115, 0.5)', zIndex: 10 }}
                />
                <img
                  src={item.secondaryItemImage || item.itemImage || '/images/placeholder.png'}
                  alt={item.name + ' alternate'}
                  className="w-full h-full object-cover absolute top-0 left-0 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
                  style={{ willChange: 'transform, opacity', zIndex: 20 }}
                />
              </div>
              <div className="mt-2 sm:mt-3 text-center">
                <h3 className="text-base sm:text-lg font-medium font-serif mb-0.5 sm:mb-1">{item.name}</h3>
                <div className="text-sm sm:text-base font-serif text-gray-600 tracking-wide italic ">₹ {item.stitchingCharge?.toLocaleString('en-IN') || 0}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="border-2 px-4 sm:px-8 py-1.5 sm:py-2 text-base sm:text-lg font-serif tracking-wider shadow-md transition-all duration-300 uppercase"
            style={{ borderRadius: 0, background: '#e3b873', color: '#222', borderColor: '#e3b873' }}
            onMouseOver={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#e3b873'; e.currentTarget.style.borderColor = '#222'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#e3b873'; e.currentTarget.style.color = '#222'; e.currentTarget.style.borderColor = '#e3b873'; }}
          >
            VIEW ALL
          </button>
        </div>
      </div>
    </section>
  );
};

export default UnisexItems; 