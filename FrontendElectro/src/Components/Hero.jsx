// src/components/Hero.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Hero() {
  const baseURL  = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/";
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    // Fetch the hero banner from your backend
    axios
      .get("http://localhost:8000/api/hero-banners/") // ✅ update this URL if needed
      .then((res) => {
        if (res.data.length > 0) {
          setBanner(res.data[0]); // If you only have 1 banner, take the first one
        }
      })
      .catch((err) => console.error("Error fetching hero banner:", err));
  }, []);

  return (
    <section className="relative py-6 md:py-14 overflow-hidden">
      {/* ✅ Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-90"></div>

      {/* ✅ Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwMDc3ZmYiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNIDAgMCBMIDYwIDYwIE0gNjAgMCBMIDAgNjAiLz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="container mx-auto text-center px-4 relative z-10">
        {/* ✅ Banner image from backend */}
        {banner?.image && (
          <div className="inline-block p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-2xl">
            <div className="bg-white p-3 rounded-full flex items-center justify-center">
              <img
                // src={`http://localhost:8000/media/HeroSectionBanner/${banner.image}`}
                src={`${baseURL}media/HeroSectionBanner/hero4.jpg`}
                alt={banner.title || "Banner"}
                className="h-28 w-28 md:h-40 md:w-40 rounded-full shadow-2xl border-4 border-blue-500 transition-transform duration-500 hover:scale-110 object-cover"
              />
            </div>
          </div>
        )}

        {/* ✅ Dynamic Title */}
        <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent mt-2 mb-3">
          {banner?.title || "Welcome to Bishal Traders"}
        </h1>

        {/* ✅ Dynamic Subtitle */}
        <p className="text-base md:text-2xl text-gray-700 font-medium mb-4">
          {banner?.subtitle || "Your trusted Auto Electric Partner ⚡"}
        </p>

        {/* ✅ Call-to-action */}
        <div className="mt-6">
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all text-lg transform hover:scale-105 duration-300"
          >
            Explore Products
          </Link>
        </div>

        {/* ✅ Contact Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <a
            href="tel:9763258057"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all text-lg transform hover:scale-105 duration-300"
          >
            📞 Call Now
          </a>
          <a
            href="https://wa.me/9779763258057?text=Hello%20Bishal%20Traders,%20I%20am%20interested%20in%20your%20products"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transition-all text-lg transform hover:scale-105 duration-300"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;



// // src/components/Hero.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import logoImg from "../assets/logo.jpg";

// function Hero() {
//   return (
//     <section className="relative py-2 md:py-10 overflow-hidden">
//       {/* Background with gradient and subtle pattern */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-90"></div>
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwMDc3ZmYiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNIDAgMCBMIDYwIDYwIE0gNjAgMCBMIDAgNjAiLz48L2c+PC9zdmc+')] opacity-20"></div>

//       <div className="container mx-auto text-center px-4 relative z-10">
//         {/* Shop Name with enhanced styling */}
//         <div className="inline-block p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-3 md:mb-6 shadow-2xl">
//           <div className="bg-white p-2 md:p-3 rounded-full flex items-center justify-center">
//             <img
//               src={logoImg}
//               alt="Logo"
//               className="h-28 w-28 md:h-36 md:w-36 rounded-full shadow-2xl border-4 border-blue-500 transition-transform duration-500 hover:scale-110"
//             />
//           </div>
//         </div>

//         <h1 className="text-2xl md:text-6xl font-bold bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent mt-2 mb-1 md:mt-0 md:mb-2">
//           Bishal Traders
//         </h1>

//         {/* Address with improved styling */}
//         <div className="mt-1 md:mt-4 flex justify-center items-center">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mr-1 md:mr-2"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//             />
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//             />
//           </svg>
//           <p className="text-sm md:text-lg text-gray-600 font-medium">
//             NewRoad, Narayangarh, Chitwan
//           </p>
//         </div>

//         {/* Tagline with improved styling */}
//         <p className="mt-2 md:mt-4 text-base md:text-xl text-gray-700 font-medium bg-blue-50 inline-block px-3 py-1 md:px-4 md:py-2 rounded-full border border-blue-100">
//           Your trusted Auto Electric Partner ⚡
//         </p>

//         {/* Call-to-action button with enhanced styling */}
//         <div className="mt-3 md:mt-8">
//           <Link
//             to="/products"
//             className="inline-flex items-center justify-center px-4 py-2 md:px-8 md:py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all text-base md:text-lg transform hover:scale-105 duration-300"
//           >
//             Explore Products
//           </Link>
//         </div>

//         {/* Contact Buttons */}
//         <div className="mt-3 md:mt-8 flex justify-center gap-3 md:gap-6">
//           <a
//             href="tel:9763258057"
//             className="inline-flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all text-sm md:text-lg transform hover:scale-105 duration-300"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//               className="w-4 h-4 md:w-6 md:h-6"
//             >
//               <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 22 2 16.39 2 9.5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" />
//             </svg>
//             Call Now
//           </a>
//           <a
//             href="https://wa.me/9779763258057?text=Hello%20Bishal%20Traders,%20I%20am%20interested%20in%20your%20products"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-600 transition-all text-sm md:text-lg transform hover:scale-105 duration-300"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 32 32"
//               className="w-4 h-4 md:w-6 md:h-6"
//             >
//               <path
//                 fill="#fff"
//                 d="M16 3C9.373 3 4 8.373 4 15c0 2.637.813 5.13 2.352 7.267L4 29l7.012-2.293A12.93 12.93 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.98 0-3.91-.58-5.563-1.68l-.397-.25-4.162 1.36 1.36-4.06-.26-.41A9.97 9.97 0 016 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.13-.61.14-.18.27-.7.9-.86 1.09-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.36-.26.29-1 1-.97 2.43.03 1.43.98 2.81 1.12 3 .14.19 2.09 3.2 5.08 4.36.71.25 1.26.4 1.69.51.71.18 1.36.16 1.87.1.57-.07 1.65-.67 1.89-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z"
//               />
//             </svg>
//             WhatsApp
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Hero;
