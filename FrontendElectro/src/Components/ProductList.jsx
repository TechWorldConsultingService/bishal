// src/components/ProductList.jsx
import React from "react";
import { useState } from "react";
import batteryImg1 from "../assets/battery.jpg";
import batteryImg2 from "../assets/battery2.jpg";
import batteryImg3 from "../assets/battery3.jpg";
import batteryImg4 from "../assets/battery4.jpg";
import lightImg1 from "../assets/light.jpg";
import lightImg2 from "../assets/light1.jpg";
import lightImg3 from "../assets/light2.jpg";
import lightImg4 from "../assets/light3.jpg";
import starterMotorImg1 from "../assets/starter_motor.jpg";
import starterMotorImg2 from "../assets/starter_motor2.jpg";
import starterMotorImg3 from "../assets/starter_motor3.jpg";
import upsImg1 from "../assets/ups.jpg";
import upsImg2 from "../assets/ups2.jpg";
import alternatorMotorImg1 from "../assets/alternator_motor.jpg";
import alternatorMotorImg2 from "../assets/alternator_motor1.jpg";
import alternatorMotorImg3 from "../assets/alternator_motor2.jpg";
import invertorImg1 from "../assets/Invertor.jpg";
import invertorImg2 from "../assets/Invertor2.jpg";
import wiperImg from "../assets/wiper.jpg";

// Sample product data (19 products)
const products = [
  {
    id: 1,
    name: "Battery 1",
    price: "Rs. 8,500",
    category: "Battery",
    subcategory: "Exide",
    image: batteryImg1,
  },
  {
    id: 2,
    name: "Battery 2",
    price: "Rs. 8,700",
    category: "Battery",
    subcategory: "Tata Green",
    image: batteryImg2,
  },
  {
    id: 3,
    name: "Battery 3",
    price: "Rs. 9,000",
    category: "Battery",
    subcategory: "ADDO",
    image: batteryImg3,
  },
  {
    id: 4,
    name: "Battery 4",
    price: "Rs. 8,200",
    category: "Battery",
    subcategory: "LivGuard",
    image: batteryImg4,
  },
  {
    id: 5,
    name: "Light 1",
    price: "Rs. 2,000",
    category: "Lights",
    image: lightImg1,
  },
  {
    id: 6,
    name: "Light 2",
    price: "Rs. 2,200",
    category: "Lights",
    image: lightImg2,
  },
  {
    id: 7,
    name: "Light 3",
    price: "Rs. 2,500",
    category: "Lights",
    image: lightImg3,
  },
  {
    id: 8,
    name: "Light 4",
    price: "Rs. 1,800",
    category: "Lights",
    image: lightImg4,
  },
  {
    id: 9,
    name: "Starter Motor 1",
    price: "Rs. 5,500",
    category: "Starter Motor",
    image: starterMotorImg1,
  },
  {
    id: 10,
    name: "Starter Motor 2",
    price: "Rs. 5,700",
    category: "Starter Motor",
    image: starterMotorImg2,
  },
  {
    id: 11,
    name: "Starter Motor 3",
    price: "Rs. 6,000",
    category: "Starter Motor",
    image: starterMotorImg3,
  },
  {
    id: 12,
    name: "Alternator Motor 1",
    price: "Rs. 6,000",
    category: "Altenator Motor",
    image: alternatorMotorImg1,
  },
  {
    id: 13,
    name: "Alternator Motor 2",
    price: "Rs. 6,200",
    category: "Altenator Motor",
    image: alternatorMotorImg2,
  },
  {
    id: 14,
    name: "Alternator Motor 3",
    price: "Rs. 6,500",
    category: "Altenator Motor",
    image: alternatorMotorImg3,
  },
  {
    id: 15,
    name: "UPS 1",
    price: "Rs. 4,000",
    category: "UPS",
    image: upsImg1,
  },
  {
    id: 16,
    name: "UPS 2",
    price: "Rs. 4,200",
    category: "UPS",
    image: upsImg2,
  },
  {
    id: 17,
    name: "Invertor 1",
    price: "Rs. 5,000",
    category: "Inverter",
    image: invertorImg1,
  },
  {
    id: 18,
    name: "Invertor 2",
    price: "Rs. 5,200",
    category: "Inverter",
    image: invertorImg2,
  },
  {
    id: 19,
    name: "Wiper",
    price: "Rs. 1,000",
    category: "Other",
    image: wiperImg,
  },
];

function ProductList({ showSeeMore = false }) {
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("All");
  const [search, setSearch] = useState("");

  // Generate unique categories + All
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Battery subcategories
  const batterySubcategories = [
    "All",
    "Exide",
    "Tata Green",
    "ADDO",
    "LivGuard",
    "Eastman",
  ];

  // Filter products based on selected category and subcategory
  let filteredProducts = products;
  if (category !== "All") {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
    if (category === "Battery" && subcategory !== "All") {
      filteredProducts = filteredProducts.filter(
        (p) => p.subcategory === subcategory
      );
    }
  }

  // Filter by search (only on Products page)
  if (!showSeeMore && search.trim()) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Show only 8 products in preview (homepage)
  if (showSeeMore) {
    filteredProducts = filteredProducts.slice(0, 8);
  }

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent inline-block">
          Our Products
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          Discover our wide range of high-quality auto electrical products for
          all your vehicle needs
        </p>
      </div>

      {/* Search Bar (only in Products page) */}
      {!showSeeMore && (
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Category Buttons with improved styling */}
      <div className="flex justify-center gap-3 mb-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setSubcategory("All"); // Reset subcategory when changing category
            }}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 ${
              category === cat
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Battery Subcategory Buttons */}
      {category === "Battery" && (
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {batterySubcategories.map((subcat) => (
            <button
              key={subcat}
              onClick={() => setSubcategory(subcat)}
              className={`px-4 py-1.5 rounded-full font-medium transition-all duration-300 text-sm ${
                subcategory === subcat
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
              }`}
            >
              {subcat}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid with improved styling */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-white rounded-lg shadow-sm px-2 py-1 text-xs font-semibold text-blue-600">
                {product.category}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {product.name}
              </h3>
              <p className="text-blue-600 font-bold">{product.price}</p>

              <div className="flex flex-col gap-1 sm:flex-row sm:gap-2 mt-4">
                <a
                  href="tel:9763258057"
                  className="w-full sm:flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white px-2 py-2 text-xs rounded-lg shadow-sm hover:bg-blue-600 transition-all duration-300 group sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce"
                  >
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 22 2 16.39 2 9.5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" />
                  </svg>
                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-center">
                    Call
                  </span>
                </a>
                <a
                  href={`https://wa.me/9779763258057?text=Hello%20Bishal%20Traders,%20I%20am%20interested%20in%20${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 flex items-center justify-center gap-1 bg-green-500 text-white px-2 py-2 text-xs rounded-lg shadow-sm hover:bg-green-600 transition-all duration-300 group sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce"
                  >
                    <path
                      fill="#fff"
                      d="M16 3C9.373 3 4 8.373 4 15c0 2.637.813 5.13 2.352 7.267L4 29l7.012-2.293A12.93 12.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.91-.58-5.563-1.68l-.397-.25-4.162 1.36 1.36-4.06-.26-.41A9.97 9.97 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.13-.61.14-.18.27-.7.9-.86 1.09-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.36-.26.29-1 1-.97 2.43.03 1.43.98 2.81 1.12 3 .14.19 2.09 3.20 5.08 4.36.71.25 1.26.40 1.69.51.71.18 1.36.16 1.87.10.57-.07 1.65-.67 1.89-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z"
                    />
                  </svg>
                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-center">
                    WhatsApp
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More Products Button at the End (conditionally rendered) */}
      {showSeeMore && (
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 group"
          >
            View More Products
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </div>
      )}
    </section>
  );
}

export default ProductList;
