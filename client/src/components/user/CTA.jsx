import React from 'react'
import {motion} from "framer-motion"
const CTA = () => {
  return (
    <div>
        <motion.section className="relative py-12 md:py-20 px-2 sm:px-4 overflow-hidden" initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }}>
        {/* Banner-2 Background Image */}
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/images/banner-2.png')" }} />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-0" />
        {/* Gold thread accent */}
        <svg className="absolute top-0 left-0 w-24 h-24 sm:w-40 sm:h-40 opacity-30 z-10 animate-spin-slow" viewBox="0 0 100 100" fill="none"><path d="M10 90 Q50 10 90 90" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/></svg>
        <div className="max-w-3xl mx-auto relative z-20">
          <motion.div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-2xl p-5 sm:p-8 md:p-16 flex flex-col items-center border border-amber-200/20" initial={{ scale: 0.96, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true }}>
            <h2 className="text-[10px] sm:text-xs font-bold text-amber-400 tracking-[0.2em] uppercase mb-2 sm:mb-4 font-serif">EXPERIENCE BESPOKE</h2>
            <h1 className="text-xl sm:text-3xl md:text-5xl font-serif font-light text-white mb-4 sm:mb-6 leading-tight drop-shadow-lg text-center">Ready to Begin Your JMD Journey?</h1>
            <p className="text-sm sm:text-lg md:text-xl text-amber-100 font-light mb-6 sm:mb-8 max-w-2xl text-center">
              Discover the art of true personalization. Book a consultation and let us craft a story that’s uniquely yours.
            </p>
            <motion.a
              href="/book"
              className="relative inline-block w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-full font-serif text-base sm:text-lg font-semibold bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-[#181c2a] shadow-lg transition-all duration-300 overflow-hidden group border-2 border-amber-300 hover:from-yellow-400 hover:to-amber-400 hover:shadow-amber-400/40 text-center"
              whileHover={{ scale: 1.06 }}
            >
              <span className="relative z-10">Book Your Experience</span>
              {/* Gold shimmer effect */}
              <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-200/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer" />
            </motion.a>
          </motion.div>
        </div>
        {/* Floating gold sparkle accent */}
        <svg className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-6 h-6 sm:w-10 sm:h-10 opacity-40 animate-pulse" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="8" fill="#fbbf24" fillOpacity="0.5"/><circle cx="16" cy="16" r="4" fill="#fbbf24" /></svg>
        <style>{`
          .animate-spin-slow { animation: spin 12s linear infinite; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
          .animate-shimmer {
            animation: shimmer 2.2s linear infinite;
          }
          @keyframes shimmer {
            0% { opacity: 0; left: -100%; }
            50% { opacity: 1; left: 0; }
            100% { opacity: 0; left: 100%; }
          }
        `}</style>
      </motion.section>
    </div>
  )
}

export default CTA
