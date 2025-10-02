import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Navbar() {
  const [shop, setShop] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/shops/")
      .then((res) => {
        if (res.data.length > 0) setShop(res.data[0]);
      })
      .catch((err) => console.error("Error fetching shop data:", err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8">
        
        {/* 🪄 Logo + Name */}
        <Link to="/" className="flex items-center gap-3 group">
          {shop?.logo ? (
            <img
              src={shop.logo}
              alt={shop?.name || "Shop Logo"}
              className="h-10 w-10 rounded-full shadow-md object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold shadow">
              {shop?.name?.[0] || "S"}
            </div>
          )}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            {shop?.name || "Shop Name"}
          </h1>
        </Link>

        {/* 🔍 Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm hover:shadow-md"
            />
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              🔍
            </span>
          </div>
        </form>

        {/* 📌 Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          {["/", "/products"].map((path, idx) => (
            <Link
              key={idx}
              to={path}
              className="relative hover:text-blue-600 transition-all duration-300 group"
            >
              {path === "/" ? "Home" : "Products"}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

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

        {/* 📱 Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full shadow hover:shadow-lg transition-all"
        >
          ☰
        </button>
      </div>

      {/* 📱 Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-blue-100 px-4 py-6 absolute w-full left-0 top-full z-50 animate-fade-in">
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          <nav className="flex flex-col gap-4 text-lg font-medium text-gray-700">
            <Link to="/" onClick={() => setMobileOpen(false)} className="hover:text-blue-600">Home</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="hover:text-blue-600">Products</Link>
            {isAuthenticated && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="hover:text-blue-600">Dashboard</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
