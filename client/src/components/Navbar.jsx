import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header>
      <nav className="m-0 p-0">
        {/* Announcement Bar */}
        <div className="announcement-bar bg-[#f77f2f] text-white">
          <div className="container mx-auto px-4 md:px-10 py-2 flex items-center justify-center text-sm md:text-base">
            <p className="font-semibold text-lg md:text-xl text-center text-white">
              JAI MATA DI STITCHING – Your satisfaction is our first priority
            </p>
          </div>
        </div>

        {/* Logo & CTA only */}
        <div className="container mx-auto px-4 md:px-10 py-2 flex justify-center items-center">
          <Link to="/" className="header-logo">
            <img
              src="/images/jmd_logo.jpeg"
              alt="Jai Mata Di Stitching Logo"
              className="w-28 h-auto object-cover"
            />
          </Link>

          {/* <Link to="/" className="custom-btn header-cta">
            Login
          </Link> */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
