import React, { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/logo.jpg";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-100">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Shop Name / Logo with gradient */}
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="Logo"
            className="h-10 w-10 rounded-full shadow"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Bishal Traders
          </h1>
        </div>

        {/* Navigation Links with enhanced hover effects */}
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link
            to="/"
            className="relative hover:text-blue-600 transition-all duration-300 group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/products"
            className="relative hover:text-blue-600 transition-all duration-300 group"
          >
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Enhanced Mobile Menu */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Menu
          </button>
        </div>
      </div>
      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-blue-100 px-4 py-6 absolute w-full left-0 top-full z-50 animate-fade-in">
          <nav className="flex flex-col gap-4 text-lg font-medium text-gray-700">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileOpen(false)}
              className="hover:text-blue-600"
            >
              Products
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
