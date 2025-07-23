import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#292928] py-4">
      <div className="container mx-auto px-4 md:px-10 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <img
            src="/images/jmd_logo.jpeg"
            alt="JMD Logo"
            className="h-8 w-8 rounded-full object-cover border border-amber-400 shadow"
          />
          <span className="text-sm text-white font-semibold tracking-wide">© 2025 JAI MATA DI STITCHING</span>
        </div>
        <p className="text-sm text-white text-center sm:text-right">
          Designed and developed by{' '}
          <a
            href="https://servora.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EB811F] hover:underline"
          >
            Servora
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
