import React from 'react';

/**
 * SectionOverlay - A modern, professional overlay for sections.
 * Props:
 *   opacity (number, default 0.18): Opacity of the overlay (0-1)
 *   position (string, one of 'top-left', 'top-right', 'bottom-left', 'bottom-right', default 'top-left')
 *   size (string, default '100%'): Size of the overlay (width/height)
 *   className (string): Additional classes for custom styling
 */
const positionStyles = {
  'top-left':   'top-0 left-0',
  'top-right':  'top-0 right-0',
  'bottom-left':'bottom-0 left-0',
  'bottom-right':'bottom-0 right-0',
};
const gradientDirections = {
  'top-left': 'to bottom right',
  'top-right': 'to bottom left',
  'bottom-left': 'to top right',
  'bottom-right': 'to top left',
};

const SectionOverlay = ({ opacity = 0.18, position = 'top-left', size = '100%', className = '' }) => (
  <div
    className={`absolute ${positionStyles[position] || positionStyles['top-left']} pointer-events-none z-10 ${className}`}
    style={{
      width: size,
      height: size,
      background: `linear-gradient(${gradientDirections[position] || 'to bottom right'}, rgba(0,0,0,${opacity * 0.7}) 0%, rgba(227,184,115,${opacity}) 100%)`,
      opacity: 0.85,
      mixBlendMode: 'soft-light',
    }}
  />
);

export default SectionOverlay; 