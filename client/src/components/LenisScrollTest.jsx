import React from 'react';
import useLenis from '../hooks/useLenis';

const LenisScrollTest = () => {
  const { scrollTo, scrollToTop } = useLenis();

  const handleScrollToSection = (sectionId) => {
    scrollTo(sectionId);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={() => handleScrollToSection('#top')}
        className="px-4 py-2 bg-amber-600 text-white rounded-lg shadow-lg hover:bg-amber-700 transition-colors duration-300 text-sm"
      >
        Scroll to Top
      </button>
      <button
        onClick={() => handleScrollToSection('#footer')}
        className="px-4 py-2 bg-amber-600 text-white rounded-lg shadow-lg hover:bg-amber-700 transition-colors duration-300 text-sm"
      >
        Scroll to Footer
      </button>
    </div>
  );
};

export default LenisScrollTest; 