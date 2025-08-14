import React, { useState, useRef } from "react";
import { useGetAllCategoriesQuery } from "@/features/api/categoriesApi";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import SectionOverlay from "../SectionOverlay";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Search, Filter, Grid, List, ShoppingBag } from "lucide-react";
import CTA from "../CTA";
import {motion} from "framer-motion"

const WomensWear = () => {
  // Filters and UI state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [viewMode, setViewMode] = useState("grid");
  const [modalImage, setModalImage] = useState(null);
  const [modalImages, setModalImages] = useState([]); // [main, secondary]
  const [activeModalIdx, setActiveModalIdx] = useState(0);
  const imgRef = useRef(null);
  const [imgTransform, setImgTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });

  // Fetch all categories
  const { data, isLoading, isError } = useGetAllCategoriesQuery();
  const categories = (data?.categories || []);

  // Filter for women's categories and search
  let filteredCategories = categories.filter((cat) => {
    const matchesCategory = cat.category === 'women';
    const matchesSearch = cat.title?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort by name (can add more sort options if needed)
  filteredCategories.sort((a, b) => (a.title || '').localeCompare(b.title || ''));

  const totalPage = Math.ceil(filteredCategories.length / limit) || 1;
  const paginatedCategories = filteredCategories.slice((page - 1) * limit, page * limit);

  // Modal image tilt effect
  const handleImgMouseMove = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 12;
    const rotateX = -((y - centerY) / centerY) * 12;
    setImgTransform({ rotateX, rotateY, scale: 1.04 });
  };
  const handleImgMouseLeave = () => {
    setImgTransform({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 relative">
      <div className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[60vh] flex items-center justify-center text-center text-white overflow-hidden mb-8 sm:mb-12 mt-[80px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/womenspage.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
        {/* Breadcrumbs */}
        <nav
          className="absolute top-16 sm:top-12 md:top-16 lg:top-20 left-1/2 -translate-x-1/2 z-20"
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
            <li className="text-amber-200 font-semibold">Women's</li>
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
            Grace Woven in Every Thread
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-100 font-light drop-shadow mt-1 sm:mt-2 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Step into a world where silhouette, luxury, and detail
            converge—designed exclusively for the empowered women.
          </motion.p>
        </motion.div>
      </div>

      {/* Overlays */}
      <SectionOverlay position="top-left" size="38%" opacity={0.18} />
      <SectionOverlay position="top-right" size="32%" opacity={0.16} />
      <SectionOverlay position="bottom-left" size="28%" opacity={0.14} />
      <SectionOverlay position="bottom-right" size="36%" opacity={0.17} />
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <BlurFade delay={0.1}>
          <div className="text-center mb-12 md:mb-16">
            <div className="mb-6 animate-pulse">
              {/* <svg
                className="w-16 h-16 md:w-20 md:h-20 mx-auto text-amber-600"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50 10 L60 30 L50 35 L40 30 Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M35 30 L65 30 L60 50 L40 50 Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M40 50 L45 70 L55 70 L60 50"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="50" cy="40" r="4" fill="currentColor" />
                <path
                  d="M30 75 L70 75 M35 80 L65 80"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M45 20 L55 20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg> */}
            </div>
            <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 font-serif animate-fadeInUp">
              ELEGANCE REDEFINED
            </h2>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-4 font-serif leading-tight animate-fadeInUp">
              Women's Couture Collection
            </h1>
            <div className="flex justify-center mb-6 animate-fadeInUp">
              <div className="flex items-center space-x-3">
                <div className="w-6 md:w-8 h-px bg-amber-300"></div>
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-amber-400 rounded-full"></div>
                <div className="w-6 md:w-8 h-px bg-amber-300"></div>
              </div>
            </div>
            {/* <p className="text-sm md:text-base text-gray-600 italic max-w-2xl mx-auto font-light leading-relaxed mb-8 animate-fadeInUp">
              "Timeless elegance meets contemporary style in our curated women's
              collection"
            </p> */}
          </div>
        </BlurFade>
        {/* Search and Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex-1 max-w-md relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              placeholder="Search women's wear..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 py-3 border border-gray-300 focus:border-rose-400 focus:ring-rose-400"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-sm transition-all ${
                viewMode === "grid"
                  ? "bg-rose-400 text-white"
                  : "bg-white text-gray-600 hover:bg-rose-100"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-sm transition-all ${
                viewMode === "list"
                  ? "bg-rose-400 text-white"
                  : "bg-white text-gray-600 hover:bg-rose-100"
              }`}
            >
              <List size={20} />
            </button>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="py-2 px-3 border border-gray-300 rounded-sm focus:border-rose-400 focus:ring-rose-400"
            >
              {[8, 16, 24, 32].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Main Content */}
        <div
          className={`grid gap-4 ${
            viewMode === "grid"
              ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-2"
          } md:gap-8`}
        >
          {isLoading ? (
            Array.from({ length: limit }).map((_, idx) => (
              <div
                key={idx}
                className="animate-pulse bg-white rounded-sm shadow-md h-72"
              />
            ))
          ) : isError ? (
            <div className="col-span-full text-center py-20 text-red-500">
              <ShoppingBag size={48} className="mx-auto mb-4" />
              <p className="text-xl font-medium">Failed to load women's categories</p>
            </div>
          ) : paginatedCategories.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-medium">No women's categories found</p>
              <p className="text-sm">Try adjusting your search</p>
            </div>
          ) : (
            paginatedCategories.map((cat, index) => (
              <BlurFade key={cat._id} delay={0.2 + index * 0.07}>
                <div
                  className={`group relative bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden ${
                    viewMode === "list"
                      ? "flex items-center space-x-8 p-6 min-h-[220px]"
                      : "p-0"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  {/* Eye Icon Button for modal */}
                  <button
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 z-30 p-2 sm:p-2.5 bg-white/90 hover:bg-rose-100 border border-rose-200 rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 transition-all duration-300 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalImages(
                        [cat.categoryPrimaryImage, cat.categorySecondaryImage].filter(Boolean)
                      );
                      setActiveModalIdx(0);
                      setModalImage(true);
                    }}
                    aria-label="View larger image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-rose-600 hover:text-rose-700 transition-colors duration-300"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  {/* Image Container */}
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "list"
                        ? "w-48 h-64 flex-shrink-0 rounded-lg"
                        : "w-full aspect-[3/4] rounded-lg"
                    }`}
                    style={{ cursor: "pointer", background: "#f9f6f3" }}
                  >
                    {/* Background Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-10"></div>
                    <img
                      src={cat.categoryPrimaryImage || "/images/placeholder.png"}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:opacity-0"
                      style={{ willChange: "transform, opacity" }}
                    />
                    {/* Transition Overlay */}
                    <div
                      className="absolute top-0 left-0 w-full h-full pointer-events-none transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-60"
                      style={{ background: 'rgba(244, 114, 182, 0.3)', zIndex: 15 }}
                    />
                    {cat.categorySecondaryImage && (
                    <img
                        src={cat.categorySecondaryImage}
                        alt={cat.title + " alternate"}
                      className="w-full h-full object-cover absolute top-0 left-0 transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-110"
                      style={{ willChange: "transform, opacity", zIndex: 20 }}
                    />
                    )}
                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 border-2 border-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" style={{ zIndex: 25 }}></div>
                  </div>
                  {/* Content */}
                  <div
                    className={`$${
                      viewMode === "list"
                        ? "flex-1 pl-6 py-2 flex flex-col justify-center"
                        : "mt-3 sm:mt-4 text-center"
                    }`}
                  >
                    <h3 className={`font-medium font-serif group-hover:text-rose-600 transition-colors duration-300 ${
                      viewMode === "list" ? "text-lg mb-1" : "text-base sm:text-lg mb-1 sm:mb-2"
                    }`}>
                      {cat.title}
                    </h3>
                    <div className={`font-serif text-gray-600 tracking-wide italic ${
                      viewMode === "list" ? "text-base font-semibold text-gray-900" : "text-sm sm:text-base"
                    }`}>
                      ₹ {cat.startingFrom ? cat.startingFrom.toLocaleString("en-IN") : 0}
                    </div>
                    {/* Decorative Underline - only in grid view */}
                    {viewMode === "grid" && (
                      <div className="mt-2 h-px w-12 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-400 mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    )}
                  </div>
                </div>
              </BlurFade>
            ))
          )}
        </div>
        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <div
            className="bg-white border border-gray-200 p-2 w-full overflow-x-auto flex justify-center"
            style={{ maxWidth: "100vw" }}
          >
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="hover:bg-rose-400 hover:text-white transition-colors"
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(totalPage, 5) }).map((_, i) => {
                  const pageNumber = page <= 3 ? i + 1 : page - 2 + i;
                  return pageNumber <= totalPage ? (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={page === pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className="hover:bg-rose-400 hover:text-white transition-colors"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null;
                })}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                    className="hover:bg-rose-400 hover:text-white transition-colors"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
      {/* Modal for enlarged image with thumbnails */}
      {modalImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative flex flex-col sm:flex-row items-center justify-center"
            style={{
              maxWidth: "420px",
              width: "100%",
              maxHeight: "90vh",
              background: "none",
              boxShadow: "none",
              padding: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-6 right-0 text-white text-4xl font-bold shadow-lg hover:text-rose-200 transition-all z-20"
              style={{
                background: "none",
                border: "none",
                lineHeight: 1,
                padding: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              }}
              onClick={() => setModalImage(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex sm:flex-col flex-row gap-2 sm:mr-3 mb-2 sm:mb-0 z-10">
              {modalImages.map((img, idx) => (
                <img
                  key={img}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`w-14 h-14 object-cover rounded-sm border-2 cursor-pointer transition-all duration-200 ${
                    activeModalIdx === idx
                      ? "border-rose-400 shadow-lg"
                      : "border-gray-200 opacity-80 hover:opacity-100"
                  }`}
                  onClick={() => setActiveModalIdx(idx)}
                  style={{ background: "#fff" }}
                />
              ))}
            </div>
            <div className="flex-1 flex flex-col items-center">
              <img
                ref={imgRef}
                src={modalImages[activeModalIdx]}
                alt="Enlarged item preview"
                className="shadow-3d object-cover bg-white"
                style={{
                  width: "320px",
                  height: "420px",
                  maxWidth: "90vw",
                  maxHeight: "80vh",
                  minWidth: "200px",
                  minHeight: "200px",
                  background: "none",
                  objectFit: "cover",
                  display: "block",
                  margin: "0 auto",
                  transform: `perspective(900px) rotateX(${imgTransform.rotateX}deg) rotateY(${imgTransform.rotateY}deg) scale(${imgTransform.scale})`,
                  zIndex: 20,
                  transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onMouseMove={handleImgMouseMove}
                onMouseLeave={handleImgMouseLeave}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
      {/* Custom styles for animation */}
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
        .animate-fadeInUp {
          animation: fadeInUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>

      <CTA />
    </div>
  );
};

export default WomensWear;
