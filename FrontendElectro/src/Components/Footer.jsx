import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Footer() {
  const [shop, setShop] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/shops/")
      .then((res) => {
        if (res.data.length > 0) setShop(res.data[0]);
      })
      .catch((err) => console.error("Error fetching shop data:", err));
  }, []);

  return (
    <footer className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-10 mt-16 shadow-inner">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* 🏢 Logo & About */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            {shop?.logo ? (
              <img
                src={shop.logo}
                alt="Logo"
                className="h-12 w-12 rounded-full object-cover shadow-lg"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center font-bold text-xl">
                {shop?.name?.[0] || "S"}
              </div>
            )}
            <h2 className="text-2xl font-bold">{shop?.name || "Shop Name"}</h2>
          </div>
          <p className="text-white/80 text-sm leading-relaxed">
            Your trusted destination for premium products. We bring quality, innovation, and reliability together to serve you better.
          </p>
        </div>

        {/* 📍 Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-white/30 inline-block pb-1">
            Quick Links
          </h3>
          <ul className="space-y-2 text-white/80">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/products" className="hover:text-white transition">Products</a></li>
            <li><a href="/admin" className="hover:text-white transition">Dashboard</a></li>
          </ul>
        </div>

        {/* 📞 Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-white/30 inline-block pb-1">
            Contact Us
          </h3>
          <p className="text-white/80 text-sm">📍 {shop?.address || "Your address here"}</p>
          <p className="text-white/80 text-sm">📞 {shop?.p_num || "+977-9800000000"}</p>
          {/* <p className="text-white/80 text-sm">📧 info@{shop?.name?.toLowerCase() || "shop"}.com</p> */}
          <p className="text-white/80 text-sm">📧 {shop?.email?.toLowerCase() || "info@{shop?.name}.com"}</p>
        </div>
      </div>

      {/* 📌 Bottom Bar */}
      <div className="border-t border-white/20 mt-10 pt-4 text-center text-white/70 text-sm">
        © {new Date().getFullYear()} {shop?.name || "TechNest Innovations Pvt Ltd"}. All rights reserved.
      </div>
    </footer>
  );
}
