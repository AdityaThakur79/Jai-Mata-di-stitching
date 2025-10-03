import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetCataloguesQuery } from "@/features/api/catalogueApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Loader2, Eye, Download, X } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white border rounded-lg shadow-sm overflow-hidden ${className}`}>{children}</div>
);

const CatalogueCard = ({ item, onView }) => {
  return (
    <Card className="flex flex-col group">
      {/* Image with hover overlay */}
      <div className="relative">
        {item.featuredImageUrl ? (
          <img src={item.featuredImageUrl} alt={item.name} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 bg-gray-100" />
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => onView(item)}>
            <Eye className="w-4 h-4 mr-2"/> View
          </Button>
          <a href={item.driveUrl} target="_blank" rel="noreferrer" className="inline-block">
            <Button size="sm" variant="secondary" className="bg-white text-gray-800 hover:bg-gray-100">
              <Download className="w-4 h-4 mr-2"/> Download
            </Button>
          </a>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-serif font-medium text-gray-900 truncate">{item.name}</h3>
          <span className="text-[10px] capitalize bg-orange-100 text-orange-700 px-2 py-0.5 rounded">{item.category}</span>
        </div>
        <p className="text-xs text-gray-500 mb-2">{item.type}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
      </div>
    </Card>
  );
};

const toPreviewUrl = (url) => {
  if (!url) return "";
  const m1 = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (m1 && m1[1]) return `https://drive.google.com/file/d/${m1[1]}/preview`;
  const m2 = url.match(/[?&]id=([^&]+)/);
  if (m2 && m2[1]) return `https://drive.google.com/file/d/${m2[1]}/preview`;
  return `https://drive.google.com/viewerng/viewer?embedded=1&url=${encodeURIComponent(url)}`;
};

const CatalogueViewerModal = ({ item, onClose }) => {
  if (!item) return null;
  const src = toPreviewUrl(item?.driveUrl);
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[85vh] flex flex-col">
        <div className="p-3 border-b flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">{item.name}</h4>
            <p className="text-xs text-gray-500 capitalize">{item.category} · {item.type}</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={item.driveUrl} target="_blank" rel="noreferrer" className="inline-block">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white" size="sm">
                <Download className="w-4 h-4 mr-2"/> Download
              </Button>
            </a>
            <Button variant="outline" size="sm" onClick={onClose}><X className="w-4 h-4"/></Button>
          </div>
        </div>
        <div className="flex-1">
          <iframe title="Catalogue PDF" src={src} className="w-full h-full" style={{ border: 0 }} />
        </div>
      </div>
    </div>
  );
};

const CataloguesUserView = () => {
  // Simplified: no filters on this section
  const [selected, setSelected] = useState(null);

  // Fetch only 4
  const { data, isLoading } = useGetCataloguesQuery({ page: 1, limit: 4 });
  const items = useMemo(() => data?.catalogues || [], [data]);

  return (
    <section className="relative py-10 md:py-16 bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-3 md:px-6">
        {/* Header (match Fabric section styling) */}
        <div className="text-center mb-8 md:mb-16">
          {/* Decorative Icon */}
          <div className="mb-6 md:mb-8 animate-pulse">
            <svg className="w-16 h-16 md:w-20 md:h-20 mx-auto text-amber-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="22" y="18" width="56" height="64" rx="6" stroke="currentColor" strokeWidth="2" fill="none"/>
              <line x1="32" y1="32" x2="68" y2="32" stroke="currentColor" strokeWidth="2"/>
              <line x1="32" y1="44" x2="68" y2="44" stroke="currentColor" strokeWidth="2"/>
              <line x1="32" y1="56" x2="68" y2="56" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>

          {/* Subtitle */}
          <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 md:mb-6 font-serif">
            CURATED COLLECTIONS
          </h2>

          {/* Main Title */}
          <h1 className="text-2xl xs:text-3xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-4 font-serif leading-tight px-2 xs:px-4">
            Featured Catalogues
          </h1>

          {/* Decorative Divider */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-6 md:w-8 h-px bg-amber-300"></div>
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-amber-400 rounded-full"></div>
              <div className="w-6 md:w-8 h-px bg-amber-300"></div>
            </div>
          </div>

          {/* Subtitle Description */}
          <p className="text-sm md:text-base text-gray-600 italic max-w-2xl mx-auto font-light leading-relaxed mb-4">
            "Explore our latest lookbooks and style edits crafted for you"
          </p>

          {/* View All Button */}
          <div className="flex justify-center">
            <Link to="/catalogues">
              <button
                className="border-2 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-serif tracking-wider shadow-md transition-all duration-300 uppercase"
                style={{ borderRadius: 0, background: '#e3b873', color: '#222', borderColor: '#e3b873' }}
                onMouseOver={e => { e.currentTarget.style.background = '#222'; e.currentTarget.style.color = '#e3b873'; e.currentTarget.style.borderColor = '#222'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#e3b873'; e.currentTarget.style.color = '#222'; e.currentTarget.style.borderColor = '#e3b873'; }}
              >
                VIEW ALL CATALOGUES
              </button>
            </Link>
          </div>
        </div>

        {/* No filters in homepage section */}

        {isLoading ? (
          <div className="text-center text-gray-500 py-12"><Loader2 className="w-6 h-6 animate-spin inline mr-2"/> Loading catalogues...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => (
              <BlurFade key={item._id} delay={0.25 + idx * 0.06}>
                <CatalogueCard item={item} onView={setSelected} />
              </BlurFade>
            ))}
            {items.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-10">No catalogues found</div>
            )}
          </div>
        )}

        {/* View All Button */}
       

        <CatalogueViewerModal item={selected} onClose={() => setSelected(null)} />
      </div>
    </section>
  );
};

export default CataloguesUserView;


