import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

const LenisProvider = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2, // Animation duration in seconds
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing function
      direction: 'vertical', // Scroll direction
      gestureDirection: 'vertical', // Gesture direction
      smooth: true,
      mouseMultiplier: 1, // Mouse wheel sensitivity
      smoothTouch: false, // Disable smooth scroll on touch devices for better performance
      touchMultiplier: 2, // Touch sensitivity
      infinite: false,
    });

    lenisRef.current = lenis;

    // Make Lenis available globally
    window.lenis = lenis;

    // Animation loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  // Function to scroll to top (for our ScrollToTop component)
  useEffect(() => {
    if (lenisRef.current) {
      window.lenisScrollToTop = () => {
        lenisRef.current.scrollTo(0, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      };
    }

    return () => {
      delete window.lenisScrollToTop;
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider; 