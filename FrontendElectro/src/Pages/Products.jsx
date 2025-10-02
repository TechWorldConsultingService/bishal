// src/pages/Products.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import ProductList from "../Components/ProductList.jsx";
import Navbar from "../Components/Navbar.jsx";
import Footer from "../Components/Footer.jsx";

function Products() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Product List Section */}
      <ProductList showSeeMore={false} initialSearch={searchQuery} />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Products;
