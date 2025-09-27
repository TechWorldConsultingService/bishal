import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Navbar() {
  const [shop, setShop] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/shops/")
      .then((res) => {
        if (res.data.length > 0) {
          setShop(res.data[0]); // ✅ use the first shop if only one exists
        }
      })
      .catch((err) => console.error("Error fetching shop data:", err));
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-blue-100">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* ✅ Dynamic Shop Name / Logo */}
        <div className="flex items-center gap-3">
          {shop?.logo ? (
            <img
              // src={`http://localhost:8000${shop.logo}`}
              src={shop.logo}
              alt={shop?.name || "Shop Logo"}
              className="h-10 w-10 rounded-full shadow object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {shop?.name?.[0] || "Shop Name"}
            </div>
          )}

          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            {shop?.name || "Loading..."}
          </h1>
        </div>

        {/* ✅ Navigation Links */}
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

          {isAuthenticated && (
            <Link
              to="/admin"
              className="relative hover:text-blue-600 transition-all duration-300 group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )}
        </nav>

        {/* ✅ Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Menu
          </button>
        </div>
      </div>

      {/* ✅ Mobile Dropdown */}
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
            {isAuthenticated && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="hover:text-blue-600"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
