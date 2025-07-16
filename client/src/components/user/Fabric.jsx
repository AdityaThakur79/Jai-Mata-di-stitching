// import React from 'react';
// import { useGetAllFabricsQuery } from '@/features/api/fabricApi';

// const Fabric = () => {
//   // Fetch first 8 fabrics for the grid
//   const { data, isLoading, isError } = useGetAllFabricsQuery({ page: 1, limit: 8, search: '' });
//   const fabrics = data?.fabrics || [];

//   if (isLoading) {
//     return <div className="text-center py-12">Loading...</div>;
//   }

//   if (isError) {
//     return <div className="text-center py-12 text-red-500">Failed to load fabrics.</div>;
//   }

//   return (
//     <section className="py-12 bg-white">
//       <div className="max-w-7xl mx-auto px-4">
//         <h2 className="text-3xl font-semibold text-center mb-2">Featured Fabrics</h2>
//         <div className="flex justify-center mb-8">
//           <button className="border border-black px-6 py-2 rounded-full text-lg hover:bg-black hover:text-white transition">VIEW ALL</button>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//           {fabrics.map((fabric) => (
//             <div key={fabric._id} className="flex flex-col items-center">
//               <div className="relative w-full aspect-[3/4] overflow-hidden group rounded-lg shadow-lg">
//                 <img
//                   src={fabric.fabricImage}
//                   alt={fabric.name}
//                   className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
//                 />
//                 <img
//                   src={fabric.secondaryFabricImage}
//                   alt={fabric.name + ' alternate'}
//                   className="w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
//                 />
//               </div>
//               <div className="mt-4 text-center">
//                 <h3 className="text-lg font-medium">{fabric.name}</h3>
//                 {/* Add more details if needed */}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Fabric;




import React from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch, Plane, Smile, BadgeCheck, Handshake } from 'lucide-react';
import SectionOverlay from './SectionOverlay';


const staticFabrics = [
  {
    _id: '1',
    name: 'Premium Cotton Twill',
    fabricImage: '/images/balck.png',
    secondaryFabricImage: '/images/menindark.png',
    price: 900,
  },
  {
    _id: '2',
    name: 'Classic Blue Denim',
    fabricImage: '/images/maroon.png',
    secondaryFabricImage: '/images/menindark.png',
    price: 900,
  },
  {
    _id: '3',
    name: 'Elegant Linen',
    fabricImage: '/images/balckwithstuc.jpg',
    secondaryFabricImage: '/images/menindark.png',
    price: 900,
  },
  {
    _id: '4',
    name: 'Soft Flannel',
    fabricImage: '/images/maroon.png',
    secondaryFabricImage: '/images/menindark.png',
    price: 900,
  },
  // Add more static fabric objects as needed
];

const Fabric = () => {
  return (
    <section className="relative py-8 sm:py-12 bg-white">
      {/* Modern Overlays */}
      <SectionOverlay position="top-left" size="38%" opacity={0.18} />
      <SectionOverlay position="top-right" size="32%" opacity={0.16} />
      <SectionOverlay position="bottom-left" size="28%" opacity={0.14} />
      <SectionOverlay position="bottom-right" size="36%" opacity={0.17} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <h2 className="text-2xl sm:text-3xl text-center mb-4 sm:mb-6">Featured Fabrics</h2>
        <div className="flex justify-center mb-6 sm:mb-8">
          <Link to="/fabrics">
            <button
              className="border-2 px-4 sm:px-8 py-1.5 sm:py-2 text-base sm:text-lg font-serif tracking-wider shadow-md transition-all duration-300 uppercase"
              style={{ borderRadius: 0, background: '#e3b873', color: '#222', borderColor: '#e3b873' }}
              onMouseOver={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#e3b873'; e.currentTarget.style.borderColor = '#222'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#e3b873'; e.currentTarget.style.color = '#222'; e.currentTarget.style.borderColor = '#e3b873'; }}
            >
              VIEW ALL
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
          {staticFabrics.map((fabric) => (
            <div key={fabric._id} className="flex flex-col items-center">
              <div className="relative w-full aspect-[3/4] overflow-hidden group rounded-lg shadow-lg">
                <img
                  src={fabric.fabricImage}
                  alt={fabric.name}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-2 group-hover:opacity-0"
                  style={{ willChange: 'transform, opacity' }}
                />
                {/* Overlay for transition */}
                <div
                  className="absolute top-0 left-0 w-full h-full pointer-events-none transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-80"
                  style={{ background: 'rgba(227, 184, 115, 0.5)', zIndex: 10 }}
                />
                <img
                  src={fabric.secondaryFabricImage}
                  alt={fabric.name + ' alternate'}
                  className="w-full h-full object-cover absolute top-0 left-0 transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-105 group-hover:-rotate-2"
                  style={{ willChange: 'transform, opacity', zIndex: 20 }}
                />
              </div>
              <div className="mt-2 sm:mt-3 text-center">
                <h3 className="text-base sm:text-lg font-medium font-serif mb-0.5 sm:mb-1">{fabric.name}</h3>
                <div className="text-sm sm:text-base font-serif text-gray-600 tracking-wide italic ">₹ {fabric.price.toLocaleString('en-IN')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Fabric;